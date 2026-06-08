const app = require('./src/app')
const { initSocket, getIO } = require('./src/config/socket')
const env = require('./src/config/env')
const http = require('http')

const server = http.createServer(app)

// Initialize Socket.io
const io = initSocket(server)

// Initialize game handlers
const initGameHandlers = require('./src/socket/handlers/game.handler')
const initHostHandlers = require('./src/socket/handlers/host.handler')
const initPlayerHandlers = require('./src/socket/handlers/player.handler')
const initTimerHandlers = require('./src/socket/handlers/timer.handler')
const initDisconnectHandlers = require('./src/socket/handlers/disconnect.handler')

initGameHandlers()
initHostHandlers()
initPlayerHandlers()
initTimerHandlers()
initDisconnectHandlers()

server.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`)
  console.log(`Environment: ${env.NODE_ENV}`)
  console.log(`Socket.io initialized`)
})