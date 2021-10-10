import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function JoinScreen({ handleJoinChat }) {
  const [username, setUsername] = React.useState("");

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image
        resizeMode="contain"
        style={{ flex: 1 }}
        source={require("../assets/chat-icon.png")}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        {...(Platform.OS === "ios" && { behavior: "padding" })}
      >
        <TextInput
          onChangeText={(text) => setUsername(text)}
          value={username}
          style={{ fontSize: 30, textAlign: "center", marginVertical: 40 }}
          placeholder="Enter username"
        />
        <Button
          title="Join Chat"
          onPress={() => username !== "" && handleJoinChat(username)}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
