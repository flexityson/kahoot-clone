import prisma from '../../config/database';

// Handle socket disconnecting event - still in rooms
export const handleDisconnecting = async (io: any, socket: any) => {
  const playerId = socket.data.playerId;
  const sessionId = socket.data.sessionId;

  if (playerId && sessionId) {
    try {
      const player = await prisma.player.findUnique({
        where: { id: playerId },
        select: { nickname: true, sessionId: true }
      });

      if (player) {
        // Notify others in the session
        socket.to(`session:${player.sessionId}`).emit('player:left', {
          playerId,
          nickname: player.nickname,
          reason: 'disconnected'
        });

        // Notify host specifically
        socket.to(`session:${player.sessionId}`).emit('host:player_left', {
          playerId,
          nickname: player.nickname,
          sessionId: player.sessionId
        });
      }
    } catch (error) {
      console.error('Disconnecting handler error:', error);
    }
  }
};

// Handle socket disconnect event - after rooms are left
export const handleDisconnect = async (io: any, socket: any) => {
  console.log(`Socket disconnected: ${socket.id}`);

  const playerId = socket.data.playerId;

  if (playerId) {
    try {
      // Delete player record
      await prisma.player.delete({
        where: { id: playerId }
      });

      console.log(`Player ${playerId} removed from session`);
    } catch (error) {
      console.error('Disconnect cleanup error:', error);
    }
  }

  // Clean up timer if exists
  if (socket.data.timerInterval) {
    clearInterval(socket.data.timerInterval);
  }
};