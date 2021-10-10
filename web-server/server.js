const express = require("express");
const http = require("http");
const WebSocket = require("ws"); //https://www.npmjs.com/package/ws
const messageHandler = require("./handlers/message.handler");

const port = 8080;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let currentUserId = 2; // we started at 2 because we dont want the chat messages sent out to appear on the right side of the GiftedChat UI. NOTE: we are using integers here because our GiftedChat uses numbers as users. In real App we would use uuid
const users = {}; //Create a directory of users with each id mapped to a ws id connection. Learn more on managing ids here https://stackoverflow.com/questions/13364243/websocketserver-node-js-how-to-differentiate-clients

function createUserAvatar() {
  const rand1 = Math.round(Math.random() * 200 + 100); //Note that Math.random generates a random number between 0 nd 1. We want the base value to be 100 thats why we added 100
  const rand2 = Math.round(Math.random() * 200 + 100);

  return `https://placeimg.com/${rand1}/${rand2}/any`;
}

wss.on("connection", (ws) => {
  //NOTE: this id property was added by us ourself. the ws value dont have this by default
  ws.id = Math.random().toString(36).substr(-8); // as assign a uniqueID to this user. Ideally we will use uuid but this will do for dev :)
  users[ws.id] = { userId: currentUserId++ }; //we map each unique ws id connection to the users

  console.log(`A user connected! ${ws.id}`);

  ws.on("close", () => {
    /** FYI: For Android and iOS device, ws connections only closes when the app is terminated, internal server-side error or the device losses wifi or data connections while app is in background or active */
    console.log(`User disconnected: ${ws.id}`);
    // remove from the map
    delete users[ws.id];
  });

  //We listen for websocket connections here by adding WebSocket EventListeners
  ws.on("message", (data, isBinary) => {
    const readableFmt = JSON.parse(data); //FYI: we used the toString() to convert the message from binary to human readable data
    switch (readableFmt.action) {
      case "join":
        users[ws.id].username = readableFmt.username;
        users[ws.id].avatar = createUserAvatar();
        //console.log(users[ws.id], ws.id);
        break;
      case "message":
        const messageText = readableFmt.text;
        //console.log("message",users[ws.id], ws.id);

        /**
         * If the user don't have a username if assigned to them, we know that the
         * have not joined the public chat yet. So there is no need to broadcast
         * the message they want to broadcast. In our app, this will never happen but
         * good to implement anyways
         *  */
        if (users[ws.id].username)
          messageHandler.handleMessage(wss, ws, users, messageText);
        break;
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
