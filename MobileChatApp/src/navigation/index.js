import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  ChatScreen,
  ChatScreenOptions,
  JoinScreen,
  JoinScreenOptions,
  FriendListScreen,
  FriendListScreenOptions,
} from "../screens";
import Strings from "../values/string";

const Stack = createStackNavigator();
const MainNavigator = ({ state }) => {
  return (
    <Stack.Navigator initialRouteName={Strings.screen_friend_list}>
      {state.username == null ? (
        // No username found, user isn't signed in
        <Stack.Screen
          name="SignIn"
          component={JoinScreen}
          options={JoinScreenOptions(state.hasJoined)}
        />
      ) : (
        // User has set a user name
        <>
          <Stack.Screen
            name={Strings.screen_chat}
            component={ChatScreen}
            options={ChatScreenOptions}
          />
          <Stack.Screen
            name={Strings.screen_friend_list}
            component={FriendListScreen}
            options={FriendListScreenOptions}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
