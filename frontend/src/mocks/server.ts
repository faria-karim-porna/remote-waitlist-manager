// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Set up the server with the handlers
export const server = setupServer(...handlers);

// Start the server in development mode
if (process.env.NODE_ENV === 'development') {
  server.listen();
}
