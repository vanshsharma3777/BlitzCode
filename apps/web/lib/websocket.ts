let socket: WebSocket | null = null;

export const connectSocket = () => {
    if (
        socket &&
        (
            socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CONNECTING
        )
    ) {
        return socket;
    }

    const wsUrl =
        process.env.NODE_ENV === "development"
            ? "ws://localhost:8080"
            : process.env.NEXT_PUBLIC_WS_URL;

    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("WS URL:", wsUrl);

    if (!wsUrl) {
        throw new Error(
            "NEXT_PUBLIC_WS_URL is not configured"
        );
    }

    socket = new WebSocket(wsUrl);

    socket.addEventListener("open", () => {
        console.log("✅ Connected to WS server");
    });

    socket.addEventListener("error", (error) => {
        console.error("❌ WebSocket error:", error);
    });

    socket.addEventListener("close", (event) => {
        console.log("🔴 WS closed:", {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
        });

        socket = null;
    });

    return socket;
};

export const sendMessage = (msg: object) => {
    if (
        socket &&
        socket.readyState === WebSocket.OPEN
    ) {
        socket.send(JSON.stringify(msg));
    } else {
        console.warn("⚠️ WebSocket is not open");
    }
};