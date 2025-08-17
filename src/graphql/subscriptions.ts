import { gql } from '@apollo/client';

export const LIST_CHATS_SUBSCRIPTION = gql`
  subscription ListChats {
    chats(order_by: { created_at: desc }) {
      id
      title
      created_at
    }
  }
`;

export const MESSAGES_SUBSCRIPTION = gql`
  subscription ListMessages($chat_id: uuid!) {
    messages(
      where: { chat_id: { _eq: $chat_id } }
      order_by: { created_at: asc }
    ) {
      id
      content
      sender
      created_at
    }
  }
`;
