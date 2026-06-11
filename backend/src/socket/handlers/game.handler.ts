import sessionService from '../../services/session.service';
import prisma from '../../config/database';

// Handle game start event
export const handleGameStart = async (io: any, socket: any, { sessionId }: { sessionId: string }) => {
  try {
    const session = await sessionService.updateSessionStatus(sessionId, 'LIVE');

    // Notify all players in session
    io.to(`session:${sessionId}`).emit('game:started', {
      quiz: session.quiz
    });
  } catch (error) {
    console.error('Game start error:', error);
    socket.emit('game:error', { message: 'Failed to start game' });
  }
};

// Handle game end event
export const handleGameEnd = async (io: any, socket: any, { sessionId }: { sessionId: string }) => {
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

    // Notify all players in session
    io.to(`session:${sessionId}`).emit('game:ended', {
      finalResults
    });
  } catch (error) {
    console.error('Game end error:', error);
    socket.emit('game:error', { message: 'Failed to end game' });
  }
};

// Handle game timeout event
export const handleGameTimeout = async (io: any, socket: any, { sessionId }: { sessionId: string }) => {
  try {
    // End game automatically
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

    // Notify all players in session
    io.to(`session:${sessionId}`).emit('game:ended', {
      finalResults
    });
  } catch (error) {
    console.error('Game timeout error:', error);
    socket.emit('game:error', { message: 'Game timed out' });
  }
};

// Handle question time up event
export const handleQuestionTimeUp = async (io: any, socket: any, { sessionId }: { sessionId: string }) => {
  try {
    const session = await sessionService.getSessionById(sessionId);
    if (!session) {
      return socket.emit('game:error', { message: 'Session not found' });
    }

    const questionIndex = session.currentQIndex;
    const currentQuestion = session.quiz.questions[questionIndex];

    if (!currentQuestion) {
      return;
    }

    // Get all answers for this question
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

    // Broadcast results
    io.to(`session:${sessionId}`).emit('question:results', {
      questionResults,
      stats: {
        totalPlayers,
        answeredCount,
        correctCount,
        correctPercentage: totalPlayers > 0 ? Math.round((correctCount / totalPlayers) * 100) : 0
      }
    });

    // Increment for next question
    await sessionService.incrementCurrentQuestion(sessionId);
  } catch (error) {
    console.error('Question time up error:', error);
    socket.emit('game:error', { message: 'Failed to process time up' });
  }
};
