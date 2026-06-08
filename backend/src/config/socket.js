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
        if (!origin || allowedOrigins.includes(origin) ||
            (typeof origin === 'string' && origin.endsWith('.vercel.app') && origin.indexOf('://') > 0)) {
          callback(null, true)
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`))
        }
      },
      methods: ['GET', 'POST'],
      credentials: true
    }
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