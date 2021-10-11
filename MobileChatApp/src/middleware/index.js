import thunk from "redux-thunk";
import { applyMiddleware } from "redux";
import websocket from "./websocket";
import ws from "../utils/Websocket";

export default applyMiddleware(thunk, websocket(ws));
