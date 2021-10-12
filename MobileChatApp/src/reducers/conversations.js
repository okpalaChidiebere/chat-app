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
      const updatedMessage = [message].concat(currMessages); //add this new message. It is important you append the new message in from of the existing message history for it to render properly in GiftedChat

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
