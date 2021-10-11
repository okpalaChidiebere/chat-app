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
import { useDispatch } from "react-redux";
import { joinChat } from "../actions";
import JoinChatContext from "../JoinChatContext";
import Strings from "../values/string";

export function JoinScreen({}) {
  const [username, setUsername] = React.useState("");
  const dispatch = useDispatch();
  const { handleJoinChat } = React.useContext(JoinChatContext);

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
          onPress={() => {
            if (username !== "") {
              dispatch(joinChat(username, true));
              handleJoinChat(username);
            }
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

export function JoinScreenOptions(hasJoined) {
  return {
    title: Strings.app_name,
    headerMode: "screen",
    // When join a chat, a pop animation feels intuitive
    animationTypeForReplace: hasJoined ? "pop" : "push",
    headerShown: false,
  };
}
