const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.username).toBe('testuser');
    });

    it('should return 400 for duplicate email', async () => {
      await User.create({
        username: 'existing',
        email: 'test@example.com',
        password: 'password123'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(400);
    });
  });

  // Add more test cases
});