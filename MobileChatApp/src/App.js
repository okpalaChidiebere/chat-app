import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainNavigator from "./navigation";
import JoinChatContext from "./JoinChatContext";

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "JOIN_CHAT":
          return {
            ...prevState,
            username: action.username,
            hasJoined: true,
          };
      }
    },
    {
      hasJoined: false,
      username: null,
    }
  );

  const authContext = React.useMemo(
    () => ({
      handleJoinChat: (username) => {
        dispatch({ type: "JOIN_CHAT", username });
      },
    }),
    []
  );

  return (
    <SafeAreaProvider>
      <JoinChatContext.Provider value={authContext}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <MainNavigator state={state} />
        </NavigationContainer>
      </JoinChatContext.Provider>
    </SafeAreaProvider>
  );
}
