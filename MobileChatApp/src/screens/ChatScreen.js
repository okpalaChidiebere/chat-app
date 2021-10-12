import React from "react";
import { GiftedChat } from "react-native-gifted-chat"; //https://github.com/FaridSafi/react-native-gifted-chat
import { useDispatch, useSelector } from "react-redux";
import { addPrivateConversation } from "../actions/conversations";

export function ChatScreen({ route }) {
  const dispatch = useDispatch();
  const { userId } = route.params;
  const selfUser = useSelector((state) => state.wsSelfUser);
  const messages = useSelector((state) => state.conversations[userId].messages);
  //console.log(selfUser);

  const sendMessage = React.useCallback((messages = []) => {
    /**
     * we send the full message object
     */
    const dataToSend = {
      message: messages[0],
      to: userId, //with this property, the server will look up users online and send this data to just this user specified here instead of everybody
    };
    dispatch(addPrivateConversation(dataToSend, true));

    /**
     * We update our UI optimistically; if the message dont get broadcasted due to
     * our ws connection is closed, we could always catch this error and rollback this
     * UI update and let the user know that there is a network issue on this end.
     */
  }, []);

  return (
    <GiftedChat
      renderUsernameOnMessage /**This will show the usernames of the user sending the message */
      messages={messages}
      onSend={(messages) => sendMessage(messages)}
      user={{
        /**
         * Any chat that dont have thesame selfUser.userId will appear on the left side of the screen
         */
        _id: selfUser.userId,
      }}
    />
  );
}

export function ChatScreenOptions({ route }) {
  const { name } = route.params;

  return {
    title: name, //display of the name person this user is chatting with
    headerMode: "screen",
    headerBackTitleVisible: false, // we dont want the back button visible for iOS
  };
  //learn more stackScreen Props here https://reactnavigation.org/docs/stack-navigator/
}
