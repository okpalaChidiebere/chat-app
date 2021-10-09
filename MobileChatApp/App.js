import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

const socketUrl = "127.0.0.1:8080";

export default function App() {
  const [messageToSend, setMessageToSend] = React.useState("");
  const socket = React.useRef(null);

  React.useEffect(() => {
    socket.current = new WebSocket(`ws://${socketUrl}`);
  }, []);

  const sendMessage = () => {
    socket.current.send(messageToSend); //send a message through the webSocket connection
    setMessageToSend(""); //clear the TextInput
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Open up App.js to start working on your app!</Text>
      <TextInput
        value={messageToSend}
        onChangeText={(text) => setMessageToSend(text)}
        placeholder="Enter Chat message.."
        onSubmitEditing={
          /** when the user presses the return key on TextInput */
          sendMessage
        }
      />
    </View>
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
