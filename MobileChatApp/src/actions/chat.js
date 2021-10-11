export const MESSAGE = "message";
export const JOIN_CHAT = "join";
export const PRIVATE_MESSAGE = "private_message";

export function message(message, socket = false) {
  return {
    type: MESSAGE,
    message,
    socket,
  };
}

export function joinChat(username, socket = false) {
  return {
    type: JOIN_CHAT,
    username,
    socket,
  };
}

export const privateMessage = (data, socket = false) => ({
  type: PRIVATE_MESSAGE,
  data,
  socket,
});
