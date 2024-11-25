import request from "supertest";
import { Server } from "http";

import { createServer } from "http";
import { app } from "../server";

// Initialize the server for testing
let server: Server;

beforeAll((done) => {
  // Create server
  server = createServer(app);
  server.listen(5000, () => {
    done();
  });
});

afterEach(() => {
  jest.clearAllMocks(); // Clear mocks between tests
});

afterAll(() => {
  server.close();
});

describe("Backend CRUD Operations", () => {
  let createdUserId: string;

  // Test POST (Create)
  test("Create a new user", async () => {
    const userData = {
      name: "Faria Karim",
      partySize: 10,
    };

    const response = await request(server).post("/api/join").send(userData).expect(201);

    console.log("response", response);

    // createdUserId = response.body._id;
    // expect(response.body.name).toBe(userData.name);
    // expect(response.body.email).toBe(userData.email);
  });

  // Test GET (Read)
  //   test('Get user by ID', async () => {
  //     const response = await request(server)
  //       .get(`/api/users/${createdUserId}`)
  //       .expect(200);

  //     expect(response.body._id).toBe(createdUserId);
  //     expect(response.body.name).toBe('John Doe');
  //   });

  // Test PUT (Update)
  //   test('Update user information', async () => {
  //     const updatedData = { name: 'Jane Doe' };

  //     const response = await request(server)
  //       .put(`/api/users/${createdUserId}`)
  //       .send(updatedData)
  //       .expect(200);

  //     expect(response.body.name).toBe(updatedData.name);
  //   });

  // Test DELETE (Delete)
  //   test('Delete a user', async () => {
  //     const response = await request(server)
  //       .delete(`/api/users/${createdUserId}`)
  //       .expect(200);

  //     expect(response.body.message).toBe('User deleted successfully');
  //   });
});
