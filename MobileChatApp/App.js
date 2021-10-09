import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat"; //https://github.com/FaridSafi/react-native-gifted-chat

const socketUrl = "127.0.0.1:8080";

export default function App() {
  const [messageToSend, setMessageToSend] = React.useState("");
  const [recvMessages, setRecvMessages] = React.useState([]);
  const socket = React.useRef(null);

  React.useEffect(() => {
    socket.current = new WebSocket(`ws://${socketUrl}`);

    setRecvMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);

    //listen for new messages send from our ws server to us
    socket.current.onmessage = (message) => {
      setRecvMessages((currState) => [...currState, message.data]);
    };
  }, []);

  const sendMessage = () => {
    socket.current.send(messageToSend); //send a message through the webSocket connection
    setMessageToSend(""); //clear the TextInput
  };

  return (
    <>
      <StatusBar style="auto" />
      <GiftedChat
        messages={recvMessages}
        /*onSend={(messages) => onSend(messages)}*/
        user={{
          _id: 1,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
