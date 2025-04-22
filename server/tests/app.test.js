const request = require('supertest');
const app = require('../app');

describe('GET /api', () => {
  it('should return API status', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toBe('API is running');
  });
});