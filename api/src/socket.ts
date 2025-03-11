import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketServer;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new SocketServer(httpServer, {
    path: '/socket.io', // Explicitly set default path
    cors: {
      origin: [
        "http://localhost:5173",  // Client
        "http://localhost:5002",  // Admin panel
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"]
    },
    transports: ['websocket', 'polling'], // Enable all transports
    allowEIO3: true // Enable compatibility mode
  });

  // Log when server starts listening
  console.log('Socket.IO server initialized');

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send current timestamp on connection
    socket.emit('connected', {
      message: 'Connected to server',
      timestamp: new Date().toISOString()
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Debug events
    socket.onAny((eventName, ...args) => {
      console.log('Received event:', eventName, args);
    });
  });

  // Log all middleware errors
  io.engine.on("connection_error", (err) => {
    console.log('Connection error:', err);
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};