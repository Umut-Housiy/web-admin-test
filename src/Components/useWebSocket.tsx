import { io } from "socket.io-client";

export const useWebSocket = (userKey) => {
  const socket = io({
    path: "/api/websocket/socket.io",
    transports: ["websocket"],
    query: {
      tq: userKey
    }
  });
  return socket;
};
