import { rest } from 'msw';

export const handlers = [
  // Auth handlers
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        token: 'mock-jwt-token',
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          isAdmin: false
        }
      })
    );
  }),

  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(
      ctx.json({
        token: 'mock-jwt-token',
        user: {
          id: '2',
          username: 'newuser',
          email: 'new@example.com',
          isAdmin: false
        }
      })
    );
  }),

  // Movie handlers
  rest.get('/api/movies/popular', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: '1',
          title: 'Inception',
          overview: 'A mind-bending movie',
          posterPath: '/inception.jpg',
          averageRating: 8.8,
          ratingCount: 1000
        }
      ])
    );
  }),

  // Add more handlers as needed
];