import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSocket } from '../../services/socketService'
import { useGameStore } from '../../store/gameStore'
import Button from '../../components/shared/Button'

export default function GamePlay() {
  const { sessionId } = useParams()
  const socket = getSocket()
  const { currentQuestion, questionIndex, totalQuestions, setCurrentQuestion, setGameState, player } = useGameStore()
  const [timeLeft, setTimeLeft] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  useEffect(() => {
    const cleanup = setupSocketListeners()

    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  useEffect(() => {
    if (currentQuestion && timeLeft > 0 && !answered) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentQuestion, timeLeft, answered])

  const setupSocketListeners = () => {
    const onQuestionNew = (data) => {
      setCurrentQuestion(data.question, data.questionIndex, data.totalQuestions)
      setTimeLeft(data.question.timeLimit)
      setAnswered(false)
      setSelectedOption(null)
      setGameState('playing')
    }

    const onQuestionResults = () => setGameState('results')
    const onAnswerReceived = () => setAnswered(true)
    const onGameEnded = () => setGameState('ended')

    socket.on('question:new', onQuestionNew)
    socket.on('question:results', onQuestionResults)
    socket.on('answer:received', onAnswerReceived)
    socket.on('game:ended', onGameEnded)

    return () => {
      socket.off('question:new', onQuestionNew)
      socket.off('question:results', onQuestionResults)
      socket.off('answer:received', onAnswerReceived)
      socket.off('game:ended', onGameEnded)
    }
  }

  const handleAnswer = (optionId) => {
    if (answered) return

    setSelectedOption(optionId)
    socket.emit('player:answer', {
      playerId: player?.id,
      questionId: currentQuestion.id,
      optionId,
      timeTaken: currentQuestion.timeLimit - timeLeft
    })
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p>Waiting for next question...</p>
        </div>
      </div>
    )
  }

  const colors = ['red', 'blue', 'yellow', 'green']
  const colorMap = {
    red: 'bg-red-500 hover:bg-red-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    yellow: 'bg-yellow-400 hover:bg-yellow-500',
    green: 'bg-green-500 hover:bg-green-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-white">
            <span className="text-sm">Question {questionIndex + 1} of {totalQuestions}</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {timeLeft}s
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-6">
          <div
            className="bg-white h-2 rounded-full transition-all"
            style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            {currentQuestion.content}
          </h2>
        </div>

        {/* Answer buttons */}
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id)}
              disabled={answered}
              className={`${colorMap[option.color || colors[idx]]}
                text-white font-bold text-lg py-6 px-8 rounded-xl
                transition transform hover:scale-105 disabled:opacity-50 disabled:transform-none
                ${selectedOption === option.id ? 'ring-4 ring-white' : ''}`}
            >
              {option.content}
            </button>
          ))}
        </div>

        {answered && (
          <div className="mt-6 text-center text-white">
            <p>⏳ Waiting for other players...</p>
          </div>
        )}
      </div>
    </div>
  )
}