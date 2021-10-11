export const RECEIVE_USERS_ONLINE = "users_online";

/**
 * IMPORTANT: The keys in this object must match the keys values returned by
 * the ws server if you want the omMessage to dispatch this correctly
 *  */
export const receiveOnlineUsers = (usersOnline) => ({
  type: RECEIVE_USERS_ONLINE,
  usersOnline,
});
