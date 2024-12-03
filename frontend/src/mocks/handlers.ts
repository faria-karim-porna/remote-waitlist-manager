// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // Define your mock API endpoints here
  rest.post('/api/join', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: 'John Doe',
        partySize: 4,
      })
    );
  }),
];
