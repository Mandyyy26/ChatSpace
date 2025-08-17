import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { nhost } from './nhost';

const HTTP_URL = import.meta.env.VITE_HASURA_GRAPHQL_URL;
const WS_URL   = import.meta.env.VITE_HASURA_GRAPHQL_WS_URL;

const httpLink = createHttpLink({
  uri: HTTP_URL,
  fetchOptions: { method: 'POST' },
});

// helper to build auth header safely
async function authHeader() {
  const token = await nhost.auth.getAccessToken(); // string | null
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const authLink = setContext(async (_, { headers }) => {
  return { headers: { ...(headers || {}), ...(await authHeader()) } };
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URL,
    // graphql-ws accepts async connectionParams
    connectionParams: async () => ({
      headers: await authHeader(),
    }),
    retryAttempts: Infinity,
    shouldRetry: () => true,
  })
);

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink)
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
