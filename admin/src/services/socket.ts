import { io } from 'socket.io-client';

// Use the correct port for Socket.IO server
const SOCKET_URL = 'http://localhost:5004';

console.log('Connecting to Socket.IO server at:', SOCKET_URL);

// Create a socket instance with configuration matching the backend
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  path: '/socket.io', // Default Socket.IO path
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  forceNew: true,
  withCredentials: true,
  // Add namespace configuration
  addTrailingSlash: false // Prevent adding trailing slash to namespace
});

// Debug connection status
let isConnected = false;

socket.on('connect', () => {
  isConnected = true;
  console.log('✅ Socket connected successfully');
  console.log('Socket ID:', socket.id);
  
  // Join the orders room after connection
  socket.emit('join_orders_room', (response: any) => {
    console.log('Joined orders room:', response);
  });
});

socket.on('disconnect', (reason) => {
  isConnected = false;
  console.log('❌ Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('🔴 Socket connection error:', error.message);
  // More detailed error logging
  console.error('Socket connection details:', {
    url: SOCKET_URL,
    error: error.message,
    transport: socket.io.engine?.transport?.name,
    protocol: window.location.protocol,
    readyState: socket.io.engine?.readyState,
    opts: socket.io.opts
  });
});

// Listen for all events in development
if (import.meta.env.DEV) {
  socket.onAny((eventName, ...args) => {
    console.log(`🔔 Socket event "${eventName}" received:`, args);
  });
}

// Export a function to check connection status
export const isSocketConnected = () => isConnected;

// Export a function to manually reconnect
export const reconnectSocket = () => {
  if (!isConnected) {
    console.log('🔄 Manually attempting to reconnect socket...');
    socket.connect();
  }
};

// Simple heartbeat to keep connection alive
setInterval(() => {
  if (isConnected) {
    socket.emit('heartbeat');
  }
}, 25000);

export default socket;