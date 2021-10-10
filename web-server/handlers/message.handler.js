const WebSocket = require("ws");

/**
 * Message Handler for our WebSocket Server. Listens for websocket connection(s)
 * that sends in messages
 *
 * @param wss WebSocket Server Connections
 * @param ws      The current webSocket connection that comes in
 * @param users       Map of users to unique connectionId
 * @param messageText  The text you want to broadcast
 * @return void
 */
function handleMessage(wss, ws, users, messageText) {
  //broadcast this new message received to all clients currently connected to our ws server
  wss.clients.forEach((client) => {
    //we broadcast this message to everyone except the sender
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      const user = users[ws.id]; //we get the userId of the person that want to broadcast their message to others from our server! we dont have to rely on the client to supply this userId which is not a good practice
      const broadCastMessage = createMessage(user, messageText);
      //console.log(broadCastMessage);
      client.send(JSON.stringify(broadCastMessage));
    }
  });
}

function createMessage(user, messageText) {
  return {
    _id: Math.random().toString(36).substr(-8), //in real app, we will use uuid
    text: messageText,
    createdAt: Date.now(),
    user: {
      _id: user.userId,
      name: user.username,
      avatar: user.avatar,
    },
  };
}

module.exports = { handleMessage };
