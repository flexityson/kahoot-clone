function calculateScore(timeTaken, timeLimit, basePoints) {
  if (timeTaken > timeLimit) return 0

  const timeRatio = 1 - (timeTaken / timeLimit)
  const score = Math.round(basePoints * (0.5 + 0.5 * timeRatio))
  return score
}

module.exports = calculateScore