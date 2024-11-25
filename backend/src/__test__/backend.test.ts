import mongoose from "mongoose";
import supertest from "supertest";
import { app, EnumStatus, mongoUri, UsersList } from "../server";

const request = supertest(app);

beforeAll(async () => {
  // Connect to a test MongoDB database
  await mongoose.connect(mongoUri ?? "");
});

afterAll(async () => {
  // Cleanup the database and disconnect
  await UsersList.deleteMany({});
  await mongoose.connection.close();
});

describe("User API", () => {
  let testUserId: string;

  it("should create a new user with status seat in", async () => {
    const response = await request.post("/api/join").send({
      name: "Faria Karim",
      partySize: 10,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("New user has been added");
    expect(response.body.user.name).toBe("Faria Karim");
    expect(response.body.user.partySize).toBe(10);
    expect(response.body.user.status).toBe(EnumStatus.SeatIn);
    // testUserId = response.body._id;
  });

  it("should create a new user with status in waiting list 1", async () => {
    const response = await request.post("/api/join").send({
      name: "Valerio Donati",
      partySize: 5,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("New user has been added");
    expect(response.body.user.name).toBe("Valerio Donati");
    expect(response.body.user.partySize).toBe(5);
    expect(response.body.user.status).toBe(EnumStatus.InWaitingList);
    expect(response.body.user.waitingPosition).toBe(1);
    expect(response.body.user.canCheckIn).toBe(false);
    // testUserId = response.body._id;
  });

  it("should create a new user with status in waiting list 2", async () => {
    const response = await request.post("/api/join").send({
      name: "Daniel Lizik",
      partySize: 5,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("New user has been added");
    expect(response.body.user.name).toBe("Daniel Lizik");
    expect(response.body.user.partySize).toBe(5);
    expect(response.body.user.status).toBe(EnumStatus.InWaitingList);
    expect(response.body.user.waitingPosition).toBe(2);
    expect(response.body.user.canCheckIn).toBe(false);
    // testUserId = response.body._id;
  });

  it("should create a new user with status in waiting list 3", async () => {
    const response = await request.post("/api/join").send({
      name: "Akash Gupta",
      partySize: 5,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("New user has been added");
    expect(response.body.user.name).toBe("Akash Gupta");
    expect(response.body.user.partySize).toBe(5);
    expect(response.body.user.status).toBe(EnumStatus.InWaitingList);
    expect(response.body.user.waitingPosition).toBe(3);
    expect(response.body.user.canCheckIn).toBe(false);
    // testUserId = response.body._id;
  });

  //   it("should fetch all users", async () => {
  //     const response = await request.get("/api/users");
  //     expect(response.status).toBe(200);
  //     expect(Array.isArray(response.body)).toBe(true);
  //     expect(response.body.length).toBeGreaterThan(0);
  //   });

  //   it("should fetch a user by ID", async () => {
  //     const response = await request.get(`/api/users/${testUserId}`);
  //     expect(response.status).toBe(200);
  //     expect(response.body._id).toBe(testUserId);
  //   });

  //   it("should update a user by ID", async () => {
  //     const response = await request.put(`/api/users/${testUserId}`).send({
  //       name: "Jane Doe",
  //     });
  //     expect(response.status).toBe(200);
  //     expect(response.body.name).toBe("Jane Doe");
  //   });

  //   it("should delete a user by ID", async () => {
  //     const response = await request.delete(`/api/users/${testUserId}`);
  //     expect(response.status).toBe(200);
  //     expect(response.body.message).toBe("User deleted successfully");

  //     const fetchResponse = await request.get(`/api/users/${testUserId}`);
  //     expect(fetchResponse.status).toBe(404);
  //   });
});
