const express = require("express");
const http = require("http");
const WebSocket = require("ws"); //https://www.npmjs.com/package/ws
const uuid = require("uuid");
const messageHandler = require("./handlers/message.handler");

const port = 8080;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const users = {}; //Create a directory of users with each id mapped to a ws id connection. Learn more on managing ids here https://stackoverflow.com/questions/13364243/websocketserver-node-js-how-to-differentiate-clients

function createUserAvatar() {
  const rand1 = Math.round(Math.random() * 200 + 100); //Note that Math.random generates a random number between 0 nd 1. We want the base value to be 100 thats why we added 100
  const rand2 = Math.round(Math.random() * 200 + 100);

  return `https://placeimg.com/${rand1}/${rand2}/any`;
}

function getUsersOnline() {
  return Object.values(users).filter((u) => u.username !== undefined);
}

wss.on("connection", (ws) => {
  //NOTE: this id property was added by us ourself. the ws value dont have this by default
  ws.id = Math.random().toString(36).substr(-8); // as assign a uniqueID to this user. Ideally we will use uuid but this will do for dev :)
  users[ws.id] = { userId: uuid.v4() }; //we map each unique ws id connection to the users

  console.log(`A user connected! ${ws.id}`);

  ws.on("close", () => {
    /** FYI: For Android and iOS device, ws connections only closes when the app is terminated, internal server-side error or the device losses wifi or data connections while app is in background or active */
    console.log(`User disconnected: ${ws.id}`);
    // remove from the map
    delete users[ws.id];

    /** As this user goes offline we broadcast to others about this. */
    wss.clients.forEach((client) => {
      //we broadcast this message to everyone excluding this connection that a this user is offline!
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "users_online",
            usersOnline: getUsersOnline(),
          })
        );
      }
    });
  });

  //We listen for websocket connections here by adding WebSocket EventListeners
  ws.on("message", (data, isBinary) => {
    const readableFmt = JSON.parse(data); //FYI: we used the toString() to convert the message from binary to human readable data
    switch (readableFmt.action) {
      case "join":
        users[ws.id].username = readableFmt.username;
        users[ws.id].avatar = createUserAvatar();
        /**
         * Get list of other online users with usernames.
         * FYI: we dont want to send the ws connectionIds.
         *  */
        const onlyUsersWithUsernames = getUsersOnline();
        wss.clients.forEach((client) => {
          //we broadcast this message to everyone including this connection that a this user came online!
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "users_online",
                usersOnline: onlyUsersWithUsernames,
              })
            );
          }
        });
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
      case "private_message":
        console.log("Got a private_message: ", readableFmt.data);
        break;
      case "hello": //for testing our redux websocket middleware!
        console.log("Got hello event", readableFmt.data);
        ws.send(JSON.stringify({ type: "message", message: "Good day!!" }));
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
