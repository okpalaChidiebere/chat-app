import {
  RECEIVE_CONVERSATIONS,
  ADD_PRIVATE_CONVERSATION,
} from "../actions/conversations";

function conversations(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CONVERSATIONS:
      return {
        ...state,
        ...action.conversations,
      };
    case ADD_PRIVATE_CONVERSATION: //when the logged in user privately messaged a user
      const { to, message } = action.data;

      const currMessages = state[to].messages; //get the current message history
      const updatedMessage = currMessages.concat([message]); //add this new message

      const updatedPrivateConversation = {
        ...state[to],
        messages: updatedMessage, //replace the old message history with the new message history
      };

      return {
        ...state,
        [to]: updatedPrivateConversation,
      };
    default:
      return state;
  }
}

export default conversations;
