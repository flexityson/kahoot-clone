// Jest tests for authentication routes

process.env.JWT_SECRET = 'test-secret';
const request = require('supertest');

// Mock dependencies before importing modules that use them
jest.mock('../src/services/auth.service');

const app = require('../src/app');
const authService = require('../src/services/auth.service');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return token', async () => {
      const mockResult = { user: { id: 'u1', name: 'Test', email: 'test@example.com', role: 'STUDENT' }, token: 'reg-token' };
      authService.register.mockResolvedValue(mockResult);

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test@example.com', password: 'password' });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ success: true, token: 'reg-token' });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login and return token', async () => {
      const mockResult = { user: { id: 'u2', name: 'Login', email: 'login@example.com', role: 'TEACHER' }, token: 'login-token' };
      authService.login.mockResolvedValue(mockResult);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'password' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ success: true, token: 'login-token' });
    });
  });

  describe('Protected routes', () => {
    let teacherToken;
    let studentToken;

    beforeAll(() => {
      // Set JWT secret for auth middleware
      process.env.JWT_SECRET = 'test-secret';
      const jwt = require('jsonwebtoken');
      // Generate valid JWTs for tests
      teacherToken = jwt.sign({ userId: 't1', role: 'TEACHER' }, process.env.JWT_SECRET);
      studentToken = jwt.sign({ userId: 's1', role: 'STUDENT' }, process.env.JWT_SECRET);
    });

    it('GET /api/auth/me returns user info', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 't1', role: 'TEACHER' });
    });

    it('GET /api/auth/admin allows TEACHER role', async () => {
      const res = await request(app)
        .get('/api/auth/admin')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ admin: true });
    });

    it('GET /api/auth/admin denies STUDENT role', async () => {
      const res = await request(app)
        .get('/api/auth/admin')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });
  });
});
