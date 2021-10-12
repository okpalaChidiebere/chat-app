# Chat APP

This project was a more advanced chat app than the [reactnd-chat-app](https://github.com/okpalaChidiebere/reactnd-chat-app) project. We learned how to:

- We learned how to handle a `join` event in the ws server. NOTE that this is different from when a user just `open` or initialize the ws connection in the client side. The user has to explicitly send this join event which returns to the user important details about their ws connection like their ws userId and other information that they can use and send back to the ws server so this server can use to uniquely identify them among other millions of ws connections
- handle public chats like broadcasting a public chat message to ws connected users
- How to broadcast when a user comes online or goes offline from the ws server to interested users. This the Demo app, it was more of broadcasting it to the whole users in the ws directory or db but in a real app, it would be more cut down to a selected individuals like a user friends, users within a certain GeoFence location for a taxi app, etc
- We learned how to send private messages across the ws server
- In the Client side, the most important thing I learned was how to connect our ws actions to redux. This made it so easy to send ws data easily as we dispatch actions to the redux store. WebSockets will still receive data and update the redux store when your app is in the background; but this does not override the fact that fetch request does not work when your app is in the background. If you need to run a fetch request in `ws.onmessage` you have to check if the mobile app is in the background, so you know when to use [expo-background-fetch](https://docs.expo.dev/versions/v42.0.0/sdk/background-fetch/) or not

# What could have been done better

I could have simplified my websocket middleware better. For example instead of having switch statements in the `ws.onnmessage` or for the `ws.send` i could have a simple formate where i trust the ws server to send back the exact action (in thesame format the client-side action creator generates for redux actions). EG

```js
ws.on("connection", (conn) => {
  conn.send(
    JSON.stringify({
      type: "USERS_ONLINE", //notice here we are sending a `type` back to the client because that is what the redux store expects
      payload: [
        /*... array of objects of users...*/
      ],
    })
  );
});
```

Then for any Redux action i want to replay to Websocket, I mark the action with meta.send with true.

```js
this.props.dispatch({
  action: "PRIVATE_MESSAGE", //notice here we are sending a `action` back to the client because that is what the ws server expects
  meta: { send: true },
  payload: { message: "..." },
});
```

This way there is consistency. If you continue with this switch statement in your current project on a large scale, your code will be very messy! You could learn a thing or two from [redux-websocket-bridge](https://www.npmjs.com/package/redux-websocket-bridge)

# WebSockets server with AWS serverless

- [https://www.serverless.com/framework/docs/providers/aws/events/websocket](https://www.serverless.com/framework/docs/providers/aws/events/websocket)
- [https://www.freecodecamp.org/news/real-time-applications-using-websockets-with-aws-api-gateway-and-lambda-a5bb493e9452/](https://www.freecodecamp.org/news/real-time-applications-using-websockets-with-aws-api-gateway-and-lambda-a5bb493e9452/)
- [https://enlabsoftware.com/development/how-to-create-real-time-chat-applications-using-websocket-apis-in-api-gateway.html](https://enlabsoftware.com/development/how-to-create-real-time-chat-applications-using-websocket-apis-in-api-gateway.html)
- [https://stackoverflow.com/questions/55785745/how-to-programmatically-connect-to-aws-websocket-api-gateway](https://stackoverflow.com/questions/55785745/how-to-programmatically-connect-to-aws-websocket-api-gateway)
- [https://stackoverflow.com/questions/58382945/how-to-send-a-response-back-to-client-using-websockets-in-aws-lambda](https://stackoverflow.com/questions/58382945/how-to-send-a-response-back-to-client-using-websockets-in-aws-lambda)
- [https://stackoverflow.com/questions/38569327/how-to-safely-parse-json-object-coming-through-websockets](https://stackoverflow.com/questions/38569327/how-to-safely-parse-json-object-coming-through-websockets)
- [webSocketServer node.js how to differentiate clients](https://stackoverflow.com/questions/13364243/websocketserver-node-js-how-to-differentiate-clients)

# AuthFlow React Navigation

- [https://reactnavigation.org/docs/auth-flow](https://reactnavigation.org/docs/auth-flow)

# Persistent connection Objects in Redux Apps

- The right place for Websockets and other persistent connection objects in a Redux app is inside of middleware. In fact, there's already [dozens of existing middleware for managing Websocket connections available](https://github.com/markerikson/redux-ecosystem-links/blob/master/middleware-sockets-adapters.md).
- Do not not keep websocket instance in redux store, instead add `SEND_MESSAGE`, `CLOSE_WEBSOCKET`, etc as redux actions
- [https://stackoverflow.com/questions/47280125/redux-add-websocket-as-prop](https://stackoverflow.com/questions/47280125/redux-add-websocket-as-prop)
- [https://stackoverflow.com/questions/58026629/standard-way-of-reconnecting-to-websocket-server-in-redux-saga](https://stackoverflow.com/questions/58026629/standard-way-of-reconnecting-to-websocket-server-in-redux-saga)

# Redux Hooks and more

- [https://react-redux.js.org/api/hooks](https://react-redux.js.org/api/hooks)
- [https://levelup.gitconnected.com/react-redux-hooks-useselector-and-usedispatch-f7d8c7f75cdd](https://levelup.gitconnected.com/react-redux-hooks-useselector-and-usedispatch-f7d8c7f75cdd)
- [batch()](https://react-redux.js.org/api/batch): you use this in your handleActions where you have to dispatch two or actions with the desired outcome leading to one combined re-render!
- [Look at this file to see a good scenario where createSelector from the reselect library can be used. he did not use it though](https://github.com/jaycode/UdaciFitness/blob/master/components/EntryDetail.js)
- [Understading createSelector](https://www.youtube.com/watch?v=wBj0ejiXbfw), [https://www.youtube.com/watch?v=wf3x7R8dOag](https://www.youtube.com/watch?v=wf3x7R8dOag)
- [React Redux Performance Optimization - Selectors & Reselect](https://www.youtube.com/watch?v=KZ6UOUCdyd4)
- [Equality Comparisons and Updates](https://react-redux.js.org/api/hooks#equality-comparisons-and-updates). This a good thing to know for optimizing your redux performance!
- [https://stackoverflow.com/questions/67384049/how-exactly-useselector-works](https://stackoverflow.com/questions/67384049/how-exactly-useselector-works)

# Debuging for me

- Ctrl+Cmd+Z
- adb -s emulator-5554 reverse tcp:8080 tcp:8080
