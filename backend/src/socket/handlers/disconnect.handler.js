const { getIO } = require('../../config/socket')
const prisma = require('../../config/database')

function initDisconnectHandlers() {
  const io = getIO()

  io.on('disconnect', async (socket) => {
    console.log(`Socket disconnected: ${socket.id}`)

    const playerId = socket.data.playerId
    const sessionId = socket.data.sessionId

    if (playerId) {
      try {
        // Get player info before deleting
        const player = await prisma.player.findUnique({
          where: { id: playerId },
          include: { session: true }
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

        // Delete player record
        await prisma.player.delete({
          where: { id: playerId }
        })

        console.log(`Player ${playerId} removed from session`)
      } catch (error) {
        console.error('Disconnect handler error:', error)
      }
    }

    // Clean up timer if exists
    if (socket.data.timerInterval) {
      clearInterval(socket.data.timerInterval)
    }

    // Leave any rooms
    const rooms = [...socket.rooms]
    rooms.forEach(room => {
      if (room !== socket.id) {
        socket.leave(room)
      }
    })
  })
}

module.exports = initDisconnectHandlers