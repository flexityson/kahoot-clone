module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx'],
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  testPathIgnorePatterns: ['/node_modules/', '/backend/', '/src/pages/teacher/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
