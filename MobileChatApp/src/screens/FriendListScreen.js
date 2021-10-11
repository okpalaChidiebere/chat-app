import React from "react";
import { View, Text, FlatList } from "react-native";
import { useSelector } from "react-redux";
import Strings from "../values/string";

export function FriendListScreen() {
  const usersOnline = useSelector((state) => state.users);
  //console.log("usersOnline", usersOnline);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
      }}
    >
      <FlatList
        data={usersOnline}
        renderItem={({ item }) => {
          return <Text>{item.username}</Text>;
        }}
        keyExtractor={(item) => item.userId}
        extraData={usersOnline}
      />
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
