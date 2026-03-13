let socket: WebSocket | null = null;

export const connectSocket = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }
  socket = new WebSocket("ws://localhost:8080");

  socket.onopen = () => {
    console.log("Connected to WS server");
  };

  socket.onclose = () => {
    console.log("WS closed");
    socket = null;
  };

  return socket;
};

export const sendMessage = (msg: Object) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  }
};
