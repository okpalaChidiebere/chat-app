import { RECEIVE_CONVERSATIONS } from "../actions/conversations";

function conversations(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CONVERSATIONS:
      return {
        ...state,
        ...action.conversations,
      };
    default:
      return state;
  }
}

export default conversations;
