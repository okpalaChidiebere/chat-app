export const MESSAGE = "message";

export function message(message, socket = false) {
  return {
    type: MESSAGE,
    message,
    socket,
  };
}
