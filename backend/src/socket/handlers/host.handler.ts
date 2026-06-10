import sessionService from '../../services/session.service';
import prisma from '../../config/database';

// Track active timers per session to avoid duplicates
const activeTimers = new Map<string, NodeJS.Timeout>();

async function startQuestionTimer(io: any, sessionId: string, duration: number) {
  // Clear any existing timer for this session
  if (activeTimers.has(sessionId)) {
    clearInterval(activeTimers.get(sessionId)!);
    activeTimers.delete(sessionId);
  }

  let remaining = duration;

  const timerInterval = setInterval(() => {
    remaining--;

    io.to(`session:${sessionId}`).emit('timer:tick', {
      remaining,
      total: duration
    });

    if (remaining <= 0) {
      clearInterval(timerInterval);
      activeTimers.delete(sessionId);
      io.to(`session:${sessionId}`).emit('timer:ended', { sessionId });
    }
  }, 1000);

  activeTimers.set(sessionId, timerInterval);
}

// Host join session
export const handleHostJoinSession = async (io: any, socket: any, { sessionId }: { sessionId: string }) => {
  try {
    socket.join(`session:${sessionId}`);
    socket.data.sessionId = sessionId;
    socket.data.isHost = true;

    // Send current session state to the host
    const session = await sessionService.getSessionById(sessionId);
    if (!session) {
      return socket.emit('host:error', { message: 'Session not found' });
    }

    const players = session.players?.map(p => ({
      id: p.id,
      nickname: p.nickname,
      avatar: p.avatar,
      totalScore: p.totalScore
    })) || [];

    socket.emit('host:session_joined', {
      sessionId,
      players,
      status: session.status,
      currentQIndex: session.currentQIndex
    });
  } catch (error) {
    console.error('Host join session error:', error);
    socket.emit('host:error', { message: 'Failed to join session' });
  }
};

// Host start game
export const handleHostStartGame = async (io: any, socket: any, { sessionId }: { sessionId: string }) => {
  try {
    const session = await sessionService.updateSessionStatus(sessionId, 'LIVE');

    io.to(`session:${sessionId}`).emit('game:started', {
      quiz: session.quiz
    });

    socket.emit('host:game_started', {
      sessionId,
      playerCount: session.players?.length || 0
    });
  } catch (error) {
    console.error('Host start game error:', error);
    socket.emit('host:error', { message: 'Failed to start game' });
  }
};

// Host next question
export const handleHostNextQuestion = async (io: any, socket: any, { sessionId }: { sessionId: string }) => {
  try {
    const session = await sessionService.getSessionById(sessionId);
    if (!session) {
      return socket.emit('host:error', { message: 'Session not found' });
    }

    const questionIndex = session.currentQIndex;
    const currentQuestion = session.quiz.questions[questionIndex];

    if (!currentQuestion) {
      io.to(`session:${sessionId}`).emit('game:ended');
      socket.emit('host:game_complete', { sessionId });
      return;
    }

    // Send question to all players (without correct answer info)
    io.to(`session:${sessionId}`).emit('question:new', {
      question: {
        id: currentQuestion.id,
        content: currentQuestion.content,
        timeLimit: currentQuestion.timeLimit,
        points: currentQuestion.points,
        options: currentQuestion.options.map(o => ({
          id: o.id,
          content: o.content,
          color: o.color
        }))
      },
      questionIndex,
      totalQuestions: session.quiz.totalQuestions
    });

    socket.emit('host:question_started', {
      questionIndex,
      timeLimit: currentQuestion.timeLimit,
      totalQuestions: session.quiz.totalQuestions,
      question: {
        id: currentQuestion.id,
        content: currentQuestion.content,
        timeLimit: currentQuestion.timeLimit,
        points: currentQuestion.points
      }
    });

    // Auto-start the server-side timer for this question
    await startQuestionTimer(io, sessionId, currentQuestion.timeLimit);

    // Increment for next question (after serving the current one)
    await sessionService.incrementCurrentQuestion(sessionId);
  } catch (error) {
    console.error('Host next question error:', error);
    socket.emit('host:error', { message: 'Failed to load next question' });
  }
};

// Host end question
export const handleHostEndQuestion = async (io: any, socket: any, { sessionId }: { sessionId: string }) => {
  try {
    const session = await sessionService.getSessionById(sessionId);
    if (!session) {
      return socket.emit('host:error', { message: 'Session not found' });
    }

    const currentQuestion = session.quiz.questions[session.currentQIndex];

    if (!currentQuestion) {
      return socket.emit('host:error', { message: 'No active question' });
    }

    const answers = await prisma.answer.findMany({
      where: {
        sessionId,
        questionId: currentQuestion.id
      },
      include: {
        player: true,
        option: true
      }
    });

    const questionResults = answers.map(a => ({
      playerId: a.player.id,
      nickname: a.player.nickname,
      isCorrect: a.isCorrect,
      timeTaken: a.timeTaken,
      pointsEarned: a.pointsEarned,
      selectedOption: a.option
    }));

    // Calculate stats
    const totalPlayers = session.players.length;
    const answeredCount = answers.length;
    const correctCount = answers.filter(a => a.isCorrect).length;

    io.to(`session:${sessionId}`).emit('question:results', {
      questionResults,
      stats: {
        totalPlayers,
        answeredCount,
        correctCount,
        correctPercentage: totalPlayers > 0 ? Math.round((correctCount / totalPlayers) * 100) : 0
      }
    });

    socket.emit('host:question_ended', {
      questionIndex: session.currentQIndex
    });
  } catch (error) {
    console.error('Host end question error:', error);
    socket.emit('host:error', { message: 'Failed to end question' });
  }
};

// Host show leaderboard
export const handleHostShowLeaderboard = async (io: any, socket: any, { sessionId }: { sessionId: string }) => {
  try {
    const players = await prisma.player.findMany({
      where: { sessionId },
      orderBy: { totalScore: 'desc' }
    });

    const leaderboard = players.map((p, idx) => ({
      rank: idx + 1,
      id: p.id,
      nickname: p.nickname,
      avatar: p.avatar,
      totalScore: p.totalScore
    }));

    io.to(`session:${sessionId}`).emit('leaderboard:update', {
      leaderboard
    });

    socket.emit('host:leaderboard_shown');
  } catch (error) {
    console.error('Host leaderboard error:', error);
    socket.emit('host:error', { message: 'Failed to load leaderboard' });
  }
};

// Host end game
export const handleHostEndGame = async (io: any, socket: any, { sessionId }: { sessionId: string }) => {
  try {
    const session = await sessionService.endGame(sessionId);

    // Sort players by score for final results
    const sortedPlayers = session.players.sort((a, b) => b.totalScore - a.totalScore);

    const finalResults = sortedPlayers.map((p, idx) => ({
      rank: idx + 1,
      id: p.id,
      nickname: p.nickname,
      avatar: p.avatar,
      totalScore: p.totalScore
    }));

    // Update quiz play count
    await prisma.quiz.update({
      where: { id: session.quizId },
      data: { playCount: { increment: 1 } }
    });

    io.to(`session:${sessionId}`).emit('game:ended', {
      finalResults
    });

    socket.emit('host:game_ended', {
      sessionId,
      totalPlayers: finalResults.length,
      quizId: session.quizId
    });
  } catch (error) {
    console.error('Host end game error:', error);
    socket.emit('host:error', { message: 'Failed to end game' });
  }
};

// Host skip question
export const handleHostSkipQuestion = async (io: any, socket: any, { sessionId }: { sessionId: string }) => {
  try {
    const session = await sessionService.incrementCurrentQuestion(sessionId);

    socket.emit('host:question_skipped', {
      questionIndex: session.currentQIndex
    });
  } catch (error) {
    console.error('Host skip question error:', error);
    socket.emit('host:error', { message: 'Failed to skip question' });
  }
};
