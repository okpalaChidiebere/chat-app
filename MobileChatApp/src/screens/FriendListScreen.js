import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Strings from "../values/string";

export function FriendListScreen({ navigation }) {
  const usersOnline = useSelector((state) => state.users);
  //console.log("usersOnline", usersOnline);
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={["top", "left", "right"]}
    >
      <FlatList
        data={usersOnline}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Strings.screen_chat, {
                  name: item.username,
                  userId: item.userId,
                })
              }
            >
              <View style={styles.itemContainerStyle}>
                <Image
                  style={styles.avatarImgStyle}
                  source={{ uri: item.avatar }}
                />
                <View style={styles.avatarNameViewStyle}>
                  <Text style={{ fontSize: 20 }}>{item.username}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.userId}
        extraData={usersOnline}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  itemContainerStyle: { flex: 1, flexDirection: "row" },
  avatarImgStyle: { width: 100, height: 100, borderRadius: 50 },
  avatarNameViewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export function FriendListScreenOptions() {
  return {
    title: Strings.app_name,
    headerMode: "screen",
    headerShown: false,
  };
}
