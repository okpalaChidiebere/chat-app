import { JOIN_CHAT, MESSAGE, message } from "../actions";

/**
 * Sends data to our WebSocket Server. As we dispatching redux actions, this middleware
 * checks to see if we marked the current action as an a data we want to send to websocket
 */
const websocket = (ws) => (store) => (next) => (action) => {
  ws.onmessage = (event) => {
    //this is fine for now, but in a prod app, we would have data with different action type, so we have to check for the actionTypes, to know what action to dispatch in our store
    return store.dispatch(message(JSON.parse(event.data)));
  };

  ws.onerror = (e) => {
    // an error occurred
    console.log(e.message);
  };

  if (action.socket) {
    let data;
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
      default:
        data = {
          action: "hello",
          data: action.data,
        };
    }

    waitForSocket(ws, () => ws.send(JSON.stringify(data)));
  }

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
