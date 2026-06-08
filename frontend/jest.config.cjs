module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx'],
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  testPathIgnorePatterns: ['/node_modules/', '/backend/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs']
};