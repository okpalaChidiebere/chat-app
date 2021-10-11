export const SET_WS_USER = "self_user";

export function setWsUser(data) {
  return {
    type: SET_WS_USER,
    /**
     * the data will be the whole userObject used to identify this user among other
     * millions of connections stored in the ws directory or db. This userObject
     * contains data like unique ws userID, avatar, userName, etc.
     *
     * NOTE, This userObject is different from the one you get from the REST API especially for the userIds;
     * they are different.
     */
    data,
  };
}
