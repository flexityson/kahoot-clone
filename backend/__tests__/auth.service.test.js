// Mock dependencies BEFORE importing authService
jest.mock('../src/utils/jwtHelper')
jest.mock('bcryptjs')

const authService = require('../src/services/auth.service')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../src/utils/jwtHelper')
const prisma = require('../src/config/database')

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('register', () => {
    it('throws error when email already exists', async () => {
      // Arrange
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'existing@test.com'
      })

      // Act & Assert
      await expect(
        authService.register('Test', 'existing@test.com', 'password')
      ).rejects.toThrow('Email already registered')
    })

    it('creates new user and returns token when email is unique', async () => {
      // Arrange
      prisma.user.findUnique.mockResolvedValue(null)
      bcrypt.hash.mockResolvedValue('hashedPassword')
      prisma.user.create.mockResolvedValue({
        id: 'new-id',
        name: 'New User',
        email: 'new@test.com',
        role: 'STUDENT'
      })
      generateToken.mockReturnValue('fake-token')

      // Act
      const result = await authService.register('New User', 'new@test.com', 'password')

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'new@test.com' }
      })
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'New User',
          email: 'new@test.com',
          password: 'hashedPassword',
          role: 'STUDENT'
        })
      })
      expect(result).toEqual({
        user: {
          id: 'new-id',
          name: 'New User',
          email: 'new@test.com',
          role: 'STUDENT'
        },
        token: 'fake-token'
      })
    })

    it('creates user with specified role when provided', async () => {
      // Arrange
      prisma.user.findUnique.mockResolvedValue(null)
      bcrypt.hash.mockResolvedValue('hashedPassword')
      prisma.user.create.mockResolvedValue({
        id: 'new-id',
        name: 'Teacher',
        email: 'teacher@test.com',
        role: 'TEACHER'
      })
      generateToken.mockReturnValue('fake-token')

      // Act
      await authService.register('Teacher', 'teacher@test.com', 'password', 'TEACHER')

      // Assert
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: 'TEACHER'
          })
        })
      )
    })
  })

  describe('login', () => {
    it('throws error when user not found', async () => {
      // Arrange
      prisma.user.findUnique.mockResolvedValue(null)

      // Act & Assert
      await expect(
        authService.login('unknown@test.com', 'password123')
      ).rejects.toThrow('Invalid email or password')
    })

    it('throws error when password is invalid', async () => {
      // Arrange
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'user@test.com',
        password: 'hashedPassword'
      })
      bcrypt.compare.mockResolvedValue(false)

      // Act & Assert
      await expect(
        authService.login('user@test.com', 'wrongpassword')
      ).rejects.toThrow('Invalid email or password')
    })

    it('returns user and token when credentials are valid', async () => {
      // Arrange
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-id',
        name: 'Test User',
        email: 'user@test.com',
        role: 'TEACHER'
      })
      bcrypt.compare.mockResolvedValue(true)
      generateToken.mockReturnValue('valid-token')

      // Act
      const result = await authService.login('user@test.com', 'correctpassword')

      // Assert
      expect(result).toEqual({
        user: {
          id: 'user-id',
          name: 'Test User',
          email: 'user@test.com',
          role: 'TEACHER'
        },
        token: 'valid-token'
      })
    })
  })
})