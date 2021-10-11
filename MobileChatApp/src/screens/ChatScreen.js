import React from "react";
import { GiftedChat } from "react-native-gifted-chat"; //https://github.com/FaridSafi/react-native-gifted-chat
import { useDispatch, useSelector } from "react-redux";
import { privateMessage } from "../actions/chat";

export function ChatScreen({ route }) {
  const [recvMessages, setRecvMessages] = React.useState([]);

  const dispatch = useDispatch();
  const { userId } = route.params;
  const selfUser = useSelector((state) => state.wsSelfUser);
  //console.log(selfUser);

  const sendMessage = React.useCallback((messages = []) => {
    /**
     * The reason we are only sending the text string value instead of the full object message data is
     * because we dont want to trust the client to send their userId themselves. The
     * user can easily switch the user._id and it will look like other persons sent the message
     *
     * Once the user connects to our ws server, the backend will assign then a
     */
    const dataToSend = {
      text: messages[0].text,
      to: userId, //with this property, the server will look up users online and send this data to just this user specified here instead of everybody
    };
    dispatch(privateMessage(dataToSend, true));
    /**
     * We update our UI optimistically; if the message dont get broadcasted due to
     * our ws connection is closed, we could always catch this error and rollback this
     * UI update and let the user know that there is a network issue on this end.
     *
     * By default the messages[0].user._id will be 1 as specified in the GiftedChat user props.
     * This message will appear on the right
     */
    setRecvMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <GiftedChat
      renderUsernameOnMessage /**This will show the usernames of the user sending the message */
      messages={recvMessages}
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
