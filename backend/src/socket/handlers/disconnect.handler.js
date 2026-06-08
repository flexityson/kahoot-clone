const prisma = require('../../config/database')

function initDisconnectHandlers(io, socket) {
  // Use 'disconnecting' event for room broadcasts — at this point the socket
  // is STILL in its rooms, so socket.to(...) can reach the right recipients.
  // The 'disconnect' event fires AFTER rooms are already left, so broadcasts
  // from disconnect would go nowhere.
  socket.on('disconnecting', async () => {
    const playerId = socket.data.playerId
    const sessionId = socket.data.sessionId

    if (playerId && sessionId) {
      try {
        const player = await prisma.player.findUnique({
          where: { id: playerId },
          select: { nickname: true, sessionId: true }
        })

        if (player) {
          // Notify others in the session
          socket.to(`session:${player.sessionId}`).emit('player:left', {
            playerId,
            nickname: player.nickname,
            reason: 'disconnected'
          })

          // Notify host specifically
          socket.to(`session:${player.sessionId}`).emit('host:player_left', {
            playerId,
            nickname: player.nickname,
            sessionId: player.sessionId
          })
        }
      } catch (error) {
        console.error('Disconnecting handler error:', error)
      }
    }
  })

  // Use 'disconnect' for cleanup that doesn't need room access
  socket.on('disconnect', async () => {
    console.log(`Socket disconnected: ${socket.id}`)

    const playerId = socket.data.playerId

    if (playerId) {
      try {
        // Delete player record
        await prisma.player.delete({
          where: { id: playerId }
        })

        console.log(`Player ${playerId} removed from session`)
      } catch (error) {
        console.error('Disconnect cleanup error:', error)
      }
    }

    // Clean up timer if exists
    if (socket.data.timerInterval) {
      clearInterval(socket.data.timerInterval)
    }
  })
}

module.exports = initDisconnectHandlers
