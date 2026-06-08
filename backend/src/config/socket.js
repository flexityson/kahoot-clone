const { Server } = require('socket.io')

let io = null

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`)
    })
  })

  return io
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket first.')
  }
  return io
}

module.exports = { initSocket, getIO }