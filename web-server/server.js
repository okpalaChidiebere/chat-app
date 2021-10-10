const express = require("express");
const http = require("http");
const WebSocket = require("ws"); //https://www.npmjs.com/package/ws

const port = 8080;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let currentUserId = 2; // we started at 2 because we dont want the chat messages sent out to appear on the right side of the GiftedChat UI. NOTE: we are using integers here because our GiftedChat uses numbers as userIds. In real App we would use uuid
const userIds = {}; //Create a directory of userIds with each id mapped to a ws id connection. Learn more on managing ids here https://stackoverflow.com/questions/13364243/websocketserver-node-js-how-to-differentiate-clients

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

wss.on("connection", (ws) => {
  //NOTE: this id property was added by us ourself. the ws value dont have this by default
  ws.id = Math.random().toString(36).substr(-8); // as assign a uniqueID to this user. Ideally we will use uuid but this will do for dev :)
  userIds[ws.id] = currentUserId++; //we map each unique ws id connection to the userIds

  console.log(`A user connected! ${ws.id}`);

  ws.on("close", () => {
    /** FYI: For Android and iOS device, ws connections only closes when the app is terminated, internal server-side error or the device losses wifi or data connections while app is in background or active */
    console.log(`User disconnected: ${ws.id}`);
    // remove from the map
    delete userIds[ws.id];
  });
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
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
