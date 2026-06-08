function generatePIN(length = 6) {
  const chars = '0123456789'
  let pin = ''
  for (let i = 0; i < length; i++) {
    pin += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pin
}

module.exports = generatePIN