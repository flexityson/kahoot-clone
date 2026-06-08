function initTimerHandlers(io, socket) {
  // Start countdown timer for a question
  socket.on('timer:start', async ({ sessionId, duration }) => {
    try {
      const totalTime = duration || 20
      let remaining = totalTime

      const timerInterval = setInterval(() => {
        remaining--

        io.to(`session:${sessionId}`).emit('timer:tick', {
          remaining,
          total: totalTime
        })

        if (remaining <= 0) {
          clearInterval(timerInterval)
          io.to(`session:${sessionId}`).emit('timer:ended', {
            sessionId
          })
        }
      }, 1000)

      // Store timer reference for cleanup
      socket.data.timerInterval = timerInterval

      socket.emit('timer:started', {
        duration: totalTime
      })
    } catch (error) {
      console.error('Timer start error:', error)
      socket.emit('timer:error', { message: 'Failed to start timer' })
    }
  })

  // Stop countdown timer
  socket.on('timer:stop', ({ sessionId }) => {
    try {
      if (socket.data.timerInterval) {
        clearInterval(socket.data.timerInterval)
        socket.data.timerInterval = null

        io.to(`session:${sessionId}`).emit('timer:stopped', {
          sessionId
        })

        socket.emit('timer:stopped', {
          sessionId
        })
      }
    } catch (error) {
      console.error('Timer stop error:', error)
      socket.emit('timer:error', { message: 'Failed to stop timer' })
    }
  })

  // Reset timer to initial value
  socket.on('timer:reset', ({ sessionId, duration }) => {
    try {
      if (socket.data.timerInterval) {
        clearInterval(socket.data.timerInterval)
      }

      io.to(`session:${sessionId}`).emit('timer:reset', {
        duration: duration || 20
      })

      socket.emit('timer:reset', {
        sessionId
      })
    } catch (error) {
      console.error('Timer reset error:', error)
      socket.emit('timer:error', { message: 'Failed to reset timer' })
    }
  })
}

module.exports = initTimerHandlers
