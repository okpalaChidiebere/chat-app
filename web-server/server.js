const express = require("express");
const http = require("http");
const WebSocket = require("ws"); //https://www.npmjs.com/package/ws

const port = 8080;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("A user connected!");
  //We listen for websocket connections here by adding WebSocket EventListeners
  ws.on("message", (message, isBinary) => {
    console.log(message.toString()); //FYI: we used the toString() to convert the message from binary to human readable data
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
