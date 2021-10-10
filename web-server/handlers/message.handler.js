const WebSocket = require("ws");

/**
 * Message Handler for our WebSocket Server. Listens for websocket connection(s)
 * that sends in messages
 *
 * @param wss WebSocket Server Connections
 * @param ws      The current webSocket connection that comes in
 * @param userIds       Map of userIds to unique connectionId
 * @return void
 */
function handleMessage(wss, ws, userIds) {
  //We listen for websocket connections here by adding WebSocket EventListeners
  ws.on("message", (message, isBinary) => {
    const messageText = message.toString(); //FYI: we used the toString() to convert the message from binary to human readable data

    //broadcast this new message received to all clients currently connected to our ws server
    wss.clients.forEach((client) => {
      if (ws === client) return; //we broadcast this message to everyone except the sender

      if (client.readyState === WebSocket.OPEN) {
        const userId = userIds[client.id]; //we get the userId from our server! we dont have to rely on the client to supply this userId which is not a good practice
        const broadCastMessage = createMessage(userId, messageText);
        //console.log(broadCastMessage);
        client.send(JSON.stringify(broadCastMessage));
      }
    });
  });
}

function createMessage(userId, messageText) {
  return {
    _id: Math.random().toString(36).substr(-8), //in real app, we will use uuid
    text: messageText,
    createdAt: Date.now(),
    user: {
      _id: userId,
      name: "React Native",
      avatar: "https://placeimg.com/140/140/any",
    },
  };
}

module.exports = { handleMessage };
