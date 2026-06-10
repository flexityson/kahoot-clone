import sessionService from '../../services/session.service';
import prisma from '../../config/database';
import calculateScore from '../../utils/calculateScore';

// Player join session
export const handlePlayerJoin = async (io: any, socket: any, { pin, nickname, avatar, userId }: { pin: string; nickname: string; avatar: string; userId?: string }) => {
  try {
    // Validate PIN format
    if (!pin || !/^\d{6}$/.test(pin)) {
      return socket.emit('player:error', { message: 'Invalid PIN format' });
    }

    // Get session by PIN
    const session = await sessionService.getSessionByPin(pin);
    if (!session) {
      return socket.emit('player:error', { message: 'Session not found' });
    }

    // Check session status - only allow joining WAITING sessions
    if (session.status !== 'WAITING') {
      return socket.emit('player:error', {
        message: session.status === 'ENDED'
          ? 'This game has already ended'
          : 'This game is already in progress'
      });
    }
    const existingPlayer = await prisma.player.findFirst({
      where: { sessionId: session.id, userId }
    });

    let player;
    if (existingPlayer) {
      // Update existing player
      player = await prisma.player.update({
        where: { id: existingPlayer.id },
        data: {
          nickname,
          avatar
        }
      });
    } else {
      // Create new player
      player = await prisma.player.create({
        data: {
          sessionId: session.id,
          nickname,
          avatar,
          userId
        }
      });
    }

    // Join the session room
    socket.join(`session:${session.id}`);
    socket.data.sessionId = session.id;

    // Broadcast player joined to all players in session
    io.to(`session:${session.id}`).emit('lobby:player_joined', {
      player: {
        id: player.id,
        nickname: player.nickname,
        avatar: player.avatar,
        totalScore: player.totalScore
      }
    });

    // Send joined confirmation to player
    socket.emit('lobby:joined', {
      player: {
        id: player.id,
        nickname: player.nickname,
        avatar: player.avatar,
        totalScore: player.totalScore
      },
      sessionId: session.id,
      pin: session.pin,
      quiz: session.quiz
    });

    // Send current session state to the new player
    socket.emit('session:state', {
      sessionId: session.id,
      pin: session.pin,
      status: session.status,
      players: session.players?.map(p => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        totalScore: p.totalScore
      })) || [],
      currentQIndex: session.currentQIndex,
      quiz: session.quiz
    });
  } catch (error) {
    console.error('Player join error:', error);
    socket.emit('player:error', { message: 'Failed to join session' });
  }
};

// Player answer question
export const handlePlayerAnswer = async (io: any, socket: any, { sessionId, questionId, answerId, timeTaken }: { sessionId: string; questionId: string; answerId: string; timeTaken: number }) => {
  try {
    // Validate session ID
    if (!sessionId || !questionId || !answerId) {
      return socket.emit('player:error', { message: 'Invalid request data' });
    }

    // Check if player is in session
    const player = await prisma.player.findFirst({
      where: {
        sessionId,
        id: socket.data.playerId
      }
    });

    if (!player) {
      return socket.emit('player:error', { message: 'Player not found in session' });
    }

    // Get question and option
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    const option = await prisma.option.findUnique({
      where: { id: answerId }
    });

    if (!question || !option) {
      return socket.emit('player:error', { message: 'Question or option not found' });
    }

    // Check if answer is correct and calculate time-based score
    const isCorrect = option.isCorrect;
    const pointsEarned = isCorrect
      ? calculateScore(timeTaken, question.timeLimit, question.points)
      : 0;

    // Create answer record
    const answer = await prisma.answer.create({
      data: {
        sessionId,
        playerId: player.id,
        questionId,
        optionId: answerId,
        isCorrect,
        timeTaken,
        pointsEarned
      }
    });

    // Update player score
    await prisma.player.update({
      where: { id: player.id },
      data: {
        totalScore: { increment: pointsEarned }
      }
    });

    // Broadcast answer to all players in session
    io.to(`session:${sessionId}`).emit('question:answer', {
      playerId: player.id,
      answerId,
      isCorrect,
      timeTaken,
      pointsEarned
    });

    socket.emit('answer:received', {
      id: answer.id,
      isCorrect,
      timeTaken,
      pointsEarned
    });
  } catch (error) {
    console.error('Player answer error:', error);
    socket.emit('player:error', { message: 'Failed to submit answer' });
  }
};

// Player leave session
export const handlePlayerLeave = async (io: any, socket: any, { sessionId }: { sessionId: string }) => {
  try {
    const sid = socket.data.sessionId;
    if (!sid) {
      return;
    }

    const playerId = socket.data.playerId;

    // Leave the session room
    socket.leave(`session:${sid}`);

    // Broadcast player left to remaining players in session
    socket.to(`session:${sid}`).emit('lobby:player_left', {
      playerId
    });

    // Clear player data from socket
    delete socket.data.sessionId;
    delete socket.data.playerId;
  } catch (error) {
    console.error('Player leave error:', error);
  }
};