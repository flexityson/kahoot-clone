const { PrismaClient } = require('@prisma/client')

// Mock Prisma for testing
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn()
  },
  quiz: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  question: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn()
  },
  option: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn()
  },
  session: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  player: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  answer: {
    create: jest.fn(),
    findMany: jest.fn()
  },
  $disconnect: jest.fn()
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma)
}))

// Make prisma available globally for tests
global.prisma = mockPrisma

// Suppress console during tests
global.console = {
  log: console.log,
  error: jest.fn(),
  warn: jest.fn(),
  info: console.info
}