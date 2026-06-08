import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

let socket = null
const disconnectCallbacks = []

export const onDisconnect = (cb) => {
  disconnectCallbacks.push(cb)
}

export const connectSocket = () => {
  if (socket?.connected) return socket
  if (socket) {
    socket.connect()
    return socket
  }

  socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5
  })

  socket.on('disconnect', () => {
    disconnectCallbacks.forEach(cb => cb())
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
  disconnectCallbacks.length = 0
}

export const getSocket = () => socket