const express = require("express");
const http = require("http");
const WebSocket = require("ws"); //https://www.npmjs.com/package/ws

const port = 8080;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  //We listen for websocket connections here by adding WebSocket EventListeners
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
