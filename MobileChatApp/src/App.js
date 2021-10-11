import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as StoreProvider } from "react-redux";
import MainNavigator from "./navigation";
import JoinChatContext from "./JoinChatContext";
import store from "./store/configureStore";

store.subscribe(() => {
  console.log("new state", store.getState());
});

store.dispatch({
  type: "hello",
  data: "Hello!!",
  socket: true,
});

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
        <StoreProvider store={store}>
          <NavigationContainer>
            <StatusBar style="auto" />
            <MainNavigator state={state} />
          </NavigationContainer>
        </StoreProvider>
      </JoinChatContext.Provider>
    </SafeAreaProvider>
  );
}
