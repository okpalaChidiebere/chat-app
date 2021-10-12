export const RECEIVE_CONVERSATIONS = "receive_conversations";
export const ADD_PRIVATE_CONVERSATION = "send_private_message";

export const receiveConversations = (conversations) => ({
  type: RECEIVE_CONVERSATIONS,
  conversations,
});

export const addPrivateConversation = (data) => ({
  type: ADD_PRIVATE_CONVERSATION,
  data,
});

export const handleReceiveConversations =
  (usersOnline) => async (dispatch, getState) => {
    /**
     * SIDE NOTE: with new users coming online, if we need to fetch previous message history between the logged user
     * and these users and populate the conversation store slice, we can do them here.
     */

    const { conversations } = getState();
    let currConversations = { ...conversations };

    for (let i = 0; i < usersOnline.length; i++) {
      const userId = usersOnline[i].userId;
      if (currConversations[userId] === undefined) {
        currConversations[userId] = {
          messages: [],
          username: usersOnline[i].username,
        };
      }
    }

    dispatch(receiveConversations(currConversations));
  };
