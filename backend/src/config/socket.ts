import { Server, Socket } from 'socket.io';
import { env } from './env';
import { SocketData } from '../socket/types';

let io: Server | null = null;

function initSocket(server: any): Server {
  const allowedOrigins = [
    env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:4173'
  ];

  io = new Server(server, {
    cors: {
      origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin) ||
          (typeof origin === 'string' && origin.endsWith('.vercel.app') && origin.indexOf('://') > 0)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`), false);
        }
      },
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  return io;
}

function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket first.');
  }
  return io;
}

export { initSocket, getIO };