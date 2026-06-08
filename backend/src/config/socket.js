const { Server } = require('socket.io')
const env = require('./env')

let io = null

function initSocket(server) {
  const allowedOrigins = [
    env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:4173'
  ]

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.some(o => origin.startsWith(o)) || origin.endsWith('.vercel.app')) {
          callback(null, true)
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`))
        }
      },
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