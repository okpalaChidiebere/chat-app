import { SET_WS_USER } from "../actions/wsSelfUser";

/**
 * We store only the ws user info here
 * NOTE: we dont store the user ws connection id. That a NO NO
 *
 * {
 *    "avatar": "https://placeimg.com/192/201/any",
 *    "userId": "2e9e657f-7ce6-4f1b-90fe-be1b4be46637",  //most important data need. which is the userId we assign to the user when the connected to the ws socket
 *    "username": "Chidi"}
 *
 */
export default function wsSelfUser(state = null, action) {
  switch (action.type) {
    case SET_WS_USER:
      return action.data;
    default:
      return state;
  }
}
