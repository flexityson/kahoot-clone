const app = require('./src/app')
const { initSocket } = require('./src/config/socket')
const env = require('./src/config/env')
const http = require('http')

const server = http.createServer(app)

// Initialize Socket.io
const io = initSocket(server)

// Load socket handlers
const hostHandler = require('./src/socket/handlers/host.handler')
const playerHandler = require('./src/socket/handlers/player.handler')
const timerHandler = require('./src/socket/handlers/timer.handler')
const disconnectHandler = require('./src/socket/handlers/disconnect.handler')
const gameHandler = require('./src/socket/handlers/game.handler')

// Register all socket handlers inside the connection callback
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`)
  hostHandler(io, socket)
  playerHandler(io, socket)
  timerHandler(io, socket)
  disconnectHandler(io, socket)
  gameHandler(io, socket)
})

server.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`)
  console.log(`Environment: ${env.NODE_ENV}`)
  console.log(`Socket.io initialized`)
})