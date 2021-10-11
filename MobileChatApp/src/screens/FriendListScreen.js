import React from "react";
import { View, Text } from "react-native";
import Strings from "../values/string";

export function FriendListScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>FriendList</Text>
    </View>
  );
}

export function FriendListScreenOptions() {
  return {
    title: Strings.app_name,
    headerMode: "screen",
    headerShown: false,
  };
}
