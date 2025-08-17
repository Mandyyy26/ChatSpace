import { gql } from '@apollo/client';

export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at
      user_id
    }
  }
`;

export const INSERT_USER_MESSAGE = gql`
  mutation InsertUserMessage(
    $chat_id: uuid!
    $content: String!
  ) {
    insert_messages_one(
      object: {
        chat_id: $chat_id
        content: $content
      }
    ) {
       id
       content
       created_at
       chat_id
     }
   }
 `;

 export const SEND_MESSAGE_ACTION = gql`
   mutation SendMessage($input: SendMessageInput!) {
     sendMessage(input: $input) {
       message_id
       reply
     }
   }
 `;