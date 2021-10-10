import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  MainScreen,
  MainScreenOptions,
  JoinScreen,
  JoinScreenOptions,
} from "../screens";
import Strings from "../values/string";

const Stack = createStackNavigator();
const MainNavigator = ({ state }) => {
  return (
    <Stack.Navigator initialRouteName={Strings.screen_main}>
      {state.username == null ? (
        // No username found, user isn't signed in
        <Stack.Screen
          name="SignIn"
          component={JoinScreen}
          options={JoinScreenOptions(state.hasJoined)}
        />
      ) : (
        // User has set a user name
        <Stack.Screen
          name={Strings.screen_main}
          component={MainScreen}
          options={MainScreenOptions}
        />
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
