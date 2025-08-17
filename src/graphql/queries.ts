import { gql } from '@apollo/client';

export const LIST_CHATS = gql`
  query ListChats {
    chats(order_by: { created_at: desc }) {
      id
      title
      created_at
      user_id
    }
  }
`;

export const MESSAGES_QUERY = gql`
  query Messages($chat_id: uuid!) {
    messages(
      where: { chat_id: { _eq: $chat_id } }
      order_by: { created_at: asc }
    ) {
      id
      content
      created_at
      chat_id
      sender
    }
  }
`;