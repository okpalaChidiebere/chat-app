import { setWsUser, SET_WS_USER } from "../actions/wsSelfUser";
import { JOIN_CHAT, MESSAGE, message, PRIVATE_MESSAGE } from "../actions/chat";
import {
  receiveOnlineUsers,
  RECEIVE_USERS_ONLINE,
} from "../actions/usersOnline";

/**
 * Sends data to our WebSocket Server. As we dispatching redux actions, this middleware
 * checks to see if we marked the current action as an a data we want to send to websocket
 */
const websocket = (ws) => (store) => (next) => (action) => {
  ws.onmessage = (event) => {
    //console.log("onMessage");
    const receivedData = JSON.parse(event.data);
    switch (receivedData.type) {
      case MESSAGE:
        return store.dispatch(message(receivedData));
      case RECEIVE_USERS_ONLINE: //if the data coming in is an updated list of online users. It could be update about a connected or disconnected ws
        return store.dispatch(receiveOnlineUsers(receivedData.usersOnline));
      case SET_WS_USER:
        return store.dispatch(setWsUser(receivedData.data));
    }
  };

  ws.onerror = (e) => {
    // an error occurred
    console.log(e.message);
  };

  if (action.socket) {
    let data;

    /**
     * IMPORTANT:
     * ideally you will want all the data you will be sending to the ws backend
     *  to be of format
     *       data = {
     *                 action: "",
     *                 data: ""
     *               }.
     * This way you dont have to write switch
     * statement for different type of data. You code will get unnecessarily long in a
     * big project where you need ws actions often
     *
     *
     * FOr DEMO purposes, this will do :)
     */

    switch (action.type) {
      case MESSAGE:
        data = {
          action: action.type,
          text: action.message,
        };
        break;
      case JOIN_CHAT:
        data = {
          action: action.type,
          username: action.username,
        };
        break;
      case PRIVATE_MESSAGE:
        data = {
          action: action.type,
          data: action.data,
        };
        break;
      default:
        data = {
          action: "hello",
          data: action.data,
        };
    }

    waitForSocket(ws, () => ws.send(JSON.stringify(data)));
  }

  //console.log("Middleware");
  return next(action);
};

function waitForSocket(wsConn, callback) {
  setTimeout(() => {
    wsConn.readyState === wsConn.OPEN
      ? callback()
      : waitForSocket(wsConn, callback);
  }, 10);
}

/** I learned how to implement this from here
 * https://github.com/igormael/react-redux-websocket
 */

export default websocket;
