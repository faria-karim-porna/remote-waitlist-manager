import mongoose from "mongoose";
import { EnumStatus } from "../dataTypes/enums";
import { UsersList } from "../models/usersModel";
import request from "supertest";
import { app } from "../server";
import { MongoMemoryServer } from "mongodb-memory-server";
import { IUser } from "../dataTypes/interfaces";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await UsersList.deleteMany({});
  await mongoose.disconnect();
  await mongoServer.stop();
});

const changeData = async (name: string, changeData: Partial<IUser>) => {
  console.log("it has been called with", changeData);
  await UsersList.findOneAndUpdate({ name }, changeData);
};

describe("User Join API", () => {
  it("should create a new user with status seat in", async () => {
    const response = await request(app).post("/api/join").send({
      name: "Faria Karim",
      partySize: 10,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("New user has been added");
    expect(response.body.user.name).toBe("Faria Karim");
    expect(response.body.user.partySize).toBe(10);
    expect(response.body.user.status).toBe(EnumStatus.SeatIn);
  });

  it("should create a new user with status in waiting list 1", async () => {
    const response = await request(app).post("/api/join").send({
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
  });

  it("should create a new user with status in waiting list 2", async () => {
    const response = await request(app).post("/api/join").send({
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
  });

  it("should create a new user with status in waiting list 3", async () => {
    const response = await request(app).post("/api/join").send({
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
  });
});

describe("User Check In API", () => {
  it("should checkin a user and status will be seat in", async () => {
    await changeData("Valerio Donati", { canCheckIn: true });
    // const updatedUser = await UsersList.findOne({ name: "Valerio Donati" });
    // expect(updatedUser?.canCheckIn).toBe(true);
    const response = await request(app).post("/api/checkIn").send({
      name: "Valerio Donati",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User has checked in");
    expect(response.body.user.name).toBe("Valerio Donati");
    expect(response.body.user.partySize).toBe(5);
    expect(response.body.user.canCheckIn).toBe(true);
    expect(response.body.user.status).toBe(EnumStatus.SeatIn);
  });
});
