import '@testing-library/jest-dom';
// src/setupTests.ts
import { server } from './mocks/server';

// Start the server before tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Close the server after all tests
afterAll(() => server.close());