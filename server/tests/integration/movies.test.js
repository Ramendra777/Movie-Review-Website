const request = require('supertest');
const app = require('../../app');
const Movie = require('../../models/Movie');
const { createTestUser, getTestUserToken } = require('../helpers');

describe('Movies API', () => {
  let authToken;

  beforeAll(async () => {
    authToken = await getTestUserToken();
  });

  describe('GET /api/movies/popular', () => {
    it('should return popular movies', async () => {
      await Movie.create([
        { title: 'Inception', averageRating: 8.8 },
        { title: 'Interstellar', averageRating: 8.6 }
      ]);

      const res = await request(app)
        .get('/api/movies/popular');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].title).toBe('Inception');
    });
  });

  describe('POST /api/movies', () => {
    it('should create a new movie with valid auth', async () => {
      const res = await request(app)
        .post('/api/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'The Dark Knight',
          overview: 'Batman movie',
          genres: ['Action', 'Drama']
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.title).toBe('The Dark Knight');
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/movies')
        .send({
          title: 'Unauthorized Movie',
          overview: 'Should fail'
        });
      
      expect(res.statusCode).toEqual(401);
    });
  });
});