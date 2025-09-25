import { io, Socket } from "socket.io-client";
import { wrapSocketWithEncryption } from "../../utils/socketEncryptionMiddleware";

// Define the socket URL using Vite environment variable or fallback
// const SOCKET_URL: string = "https://devnode.coderkubes.com";
const SOCKET_URL: string = "https://staging-backend.primeeleague.com";

// Define interface for chat message (matches MatchDetails component)
interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  matchId?: string; // Optional, for match-specific messages
}

// Initialize Socket.IO client
export const socket: Socket = wrapSocketWithEncryption(
  io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: false,
  })
);

// Connect to the socket
socket.connect();

// Handle connection
socket.on("connect", () => {
  console.log("Socket connected");
});

// Handle disconnection
socket.on("disconnect", (reason: string) => {
  console.log("Socket disconnected:", reason);
});

// Handle connection errors
socket.on("connect_error", (error: Error) => {
  console.log(
    "Socket connection error:",
    error.message,
    error.stack,
    error.name
  );
});

// Function to send a chat message
export function sendMatchMsg(body: ChatMessage): void {
  socket.emit("message", body); // Emit 'message' event to the server
}
