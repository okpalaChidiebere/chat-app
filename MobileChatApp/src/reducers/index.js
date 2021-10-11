/** This files exports our invocation to combineReducers passing it all of our reducers
The initial state of our store with data when empty looks like
{
    messages: {},
    usersOnline: [],
} 
**/

import { combineReducers } from "redux";
import users from "./users";
import messages from "./messages";

//We combine all reducers into a main root reducer because the createStore function only accepts a single reducer
export default combineReducers({
  users,
  messages,
});
