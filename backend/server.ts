import express from 'express';
import http from 'http';
import { initSocket } from './src/config/socket';
import { env } from './src/config/env';

// Load required modules
import app from './src/app';

// Load socket handlers
import { handleHostJoinSession, handleHostStartGame, handleHostNextQuestion, handleHostEndQuestion, handleHostShowLeaderboard, handleHostEndGame, handleHostSkipQuestion } from './src/socket/handlers/host.handler';
import { handlePlayerJoin, handlePlayerAnswer, handlePlayerLeave } from './src/socket/handlers/player.handler';
import { handleTimerStart, handleTimerStop, handleTimerReset } from './src/socket/handlers/timer.handler';
import { handleDisconnecting, handleDisconnect } from './src/socket/handlers/disconnect.handler';
import { handleGameStart, handleGameEnd, handleGameTimeout, handleQuestionTimeUp } from './src/socket/handlers/game.handler';

// Initialize server
const server = http.createServer(app);

// Initialize Socket.io
const io = initSocket(server);

// Register all socket handlers
io.on('connection', (socket: any) => {
  console.log(`Socket connected: ${socket.id}`);

  // Host handlers
  socket.on('host:join_session', (data: any) => {
    handleHostJoinSession(io, socket, data);
  });

  socket.on('host:start_game', (data: any) => {
    handleHostStartGame(io, socket, data);
  });

  socket.on('host:next_question', (data: any) => {
    handleHostNextQuestion(io, socket, data);
  });

  socket.on('host:end_question', (data: any) => {
    handleHostEndQuestion(io, socket, data);
  });

  socket.on('host:show_leaderboard', (data: any) => {
    handleHostShowLeaderboard(io, socket, data);
  });

  socket.on('host:end_game', (data: any) => {
    handleHostEndGame(io, socket, data);
  });

  socket.on('host:skip_question', (data: any) => {
    handleHostSkipQuestion(io, socket, data);
  });

  // Player handlers
  socket.on('player:join', (data: any) => {
    handlePlayerJoin(io, socket, data);
  });

  socket.on('player:answer', (data: any) => {
    handlePlayerAnswer(io, socket, data);
  });

  socket.on('player:leave', (data: any) => {
    handlePlayerLeave(io, socket, data);
  });

  // Timer handlers
  socket.on('timer:start', (data: any) => {
    handleTimerStart(io, socket, data);
  });

  socket.on('timer:stop', (data: any) => {
    handleTimerStop(io, socket, data);
  });

  socket.on('timer:reset', (data: any) => {
    handleTimerReset(io, socket, data);
  });

  // Game handlers
  socket.on('game:start', (data: any) => {
    handleGameStart(io, socket, data);
  });

  socket.on('game:end', (data: any) => {
    handleGameEnd(io, socket, data);
  });

  // Disconnect handlers
  socket.on('disconnecting', () => {
    handleDisconnecting(io, socket);
  });

  socket.on('disconnect', () => {
    handleDisconnect(io, socket);
  });
});

// Start server
server.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`Socket.io initialized`);
});

// Graceful shutdown – disconnect Prisma client
process.on('SIGINT', async () => {
  console.log('Received SIGINT – shutting down');
  const prisma = require('./src/config/database');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM – shutting down');
  const prisma = require('./src/config/database');
  await prisma.$disconnect();
  process.exit(0);
});