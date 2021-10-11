import { MESSAGE } from "../actions/chat";

function messages(state = {}, action) {
  switch (action.type) {
    case MESSAGE:
      return {
        ...state,
        ...action.message,
      };
    default:
      return state;
  }
}

export default messages;
