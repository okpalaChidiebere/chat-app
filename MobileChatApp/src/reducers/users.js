import { RECEIVE_USERS_ONLINE } from "../actions/usersOnline";

function usersOnline(state = [], action) {
  switch (action.type) {
    case RECEIVE_USERS_ONLINE:
      return action.usersOnline;
    default:
      return state;
  }
}

export default usersOnline;
