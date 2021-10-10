import React from "react";
import { GiftedChat } from "react-native-gifted-chat"; //https://github.com/FaridSafi/react-native-gifted-chat
import Strings from "../values/string";

const socketUrl = "127.0.0.1:8080";

export function MainScreen() {
  const [recvMessages, setRecvMessages] = React.useState([]);
  const socket = React.useRef(null);

  React.useEffect(() => {
    socket.current = new WebSocket(`ws://${socketUrl}`);

    //listen for new messages send from our ws server to us
    socket.current.onmessage = (message) => {
      const msg = JSON.parse(message.data);

      /**
       * Our server is responsible for creating the message object correctly,
       * then the UI will now have to render the message on the left or right side(the one we send)
       * based on user._id value
       */
      setRecvMessages((previousMessages) =>
        GiftedChat.append(previousMessages, msg)
      );
    };
  }, []);

  const sendMessage = React.useCallback((messages = []) => {
    /**
     * The reason we are only sending the text string value instead of the full object message data is
     * because we dont want to trust the client to send their userId themselves. The
     * user can easily switch the user._id and it will look like other persons sent the message
     *
     * Once the user connects to our ws server, the backend will assign then a
     */
    if (socket.current.readyState === socket.current.OPEN) {
      const data = {
        action: "message",
        text: messages[0].text,
      };
      socket.current.send(JSON.stringify(data)); //we need just the text value to send to our ws backend which will broadcast this message to others
    }

    /**
     * We update our UI optimistically; if the message dont get broadcasted due to
     * our ws connection is closed, we could always catch this error and rollback this
     * UI update and let the user know that there is a network issue on this end.
     *
     * By default the messages[0].user._id will be 1 as specified in the GiftedChat user props.
     * This message will appear on the right
     */
    setRecvMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const joinChat = React.useCallback((username) => {
    socket.current.send(
      JSON.stringify({
        action: "join",
        username,
      })
    );
    setHasJoined(true);
  }, []);

  return (
    <GiftedChat
      renderUsernameOnMessage /**This will show the usernames of the user sending the message */
      messages={recvMessages}
      onSend={(messages) => sendMessage(messages)}
      user={{
        /**
         * Gifted messages with userId 1 appears on the right side of the chat UI with a default
         * blue color background container view
         *
         * When the userId is 1, it means that we wrote the message. If we change the id to 2,
         * then all messages with user._id of 2 will appear on the right as every other messages
         * will appear on the left
         *
         * NOTE: in real App, we would use uuid as userIds and thesame concepts will apply as well.
         * But for this demo, this will do
         */
        _id: 1,
      }}
    />
  );
}

export function MainScreenOptions() {
  return {
    title: Strings.app_name,
    headerMode: "screen",
    headerShown: false,
  };
}
