let socket: WebSocket | null = null;

export const connectSocket = () => {
  if (socket) return socket;

  socket = new WebSocket("ws://localhost:8080");

  socket.onopen = () => {
    console.log("Connected to WS server");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Message:", data);
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
