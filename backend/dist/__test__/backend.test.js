"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../dataTypes/enums");
const usersModel_1 = require("../models/usersModel");
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongoServer;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoose_1.default.connection.readyState !== 0) {
        yield mongoose_1.default.disconnect();
    }
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    yield mongoose_1.default.connect(uri);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield usersModel_1.UsersList.deleteMany({});
    yield mongoose_1.default.disconnect();
    yield mongoServer.stop();
}));
const changeData = (name, changeData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("it has been called with", changeData);
    yield usersModel_1.UsersList.findOneAndUpdate({ name }, changeData);
});
describe("User Join API", () => {
    it("should create a new user with status seat in", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app).post("/api/join").send({
            name: "Faria Karim",
            partySize: 10,
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("New user has been added");
        expect(response.body.user.name).toBe("Faria Karim");
        expect(response.body.user.partySize).toBe(10);
        expect(response.body.user.status).toBe(enums_1.EnumStatus.SeatIn);
    }));
    it("should create a new user with status in waiting list 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app).post("/api/join").send({
            name: "Valerio Donati",
            partySize: 5,
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("New user has been added");
        expect(response.body.user.name).toBe("Valerio Donati");
        expect(response.body.user.partySize).toBe(5);
        expect(response.body.user.status).toBe(enums_1.EnumStatus.InWaitingList);
        expect(response.body.user.waitingPosition).toBe(1);
        expect(response.body.user.canCheckIn).toBe(false);
    }));
    it("should create a new user with status in waiting list 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app).post("/api/join").send({
            name: "Daniel Lizik",
            partySize: 5,
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("New user has been added");
        expect(response.body.user.name).toBe("Daniel Lizik");
        expect(response.body.user.partySize).toBe(5);
        expect(response.body.user.status).toBe(enums_1.EnumStatus.InWaitingList);
        expect(response.body.user.waitingPosition).toBe(2);
        expect(response.body.user.canCheckIn).toBe(false);
    }));
    it("should create a new user with status in waiting list 3", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app).post("/api/join").send({
            name: "Akash Gupta",
            partySize: 5,
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("New user has been added");
        expect(response.body.user.name).toBe("Akash Gupta");
        expect(response.body.user.partySize).toBe(5);
        expect(response.body.user.status).toBe(enums_1.EnumStatus.InWaitingList);
        expect(response.body.user.waitingPosition).toBe(3);
        expect(response.body.user.canCheckIn).toBe(false);
    }));
});
describe("User Delete API", () => {
    it("should delete a user", () => __awaiter(void 0, void 0, void 0, function* () {
        yield changeData("Faria Karim", { status: enums_1.EnumStatus.ServiceCompleted });
        const updatedUser = yield usersModel_1.UsersList.findOne({ name: "Faria Karim" });
        expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.status).toBe(enums_1.EnumStatus.ServiceCompleted);
        const response = yield (0, supertest_1.default)(server_1.app).delete("/api/deleteUser").send({
            name: "Faria Karim",
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User has been deleted");
    }));
});
describe("User Check In API", () => {
    it("should checkin a user and status will be seat in", () => __awaiter(void 0, void 0, void 0, function* () {
        yield changeData("Valerio Donati", { canCheckIn: true });
        // const updatedUser = await UsersList.findOne({ name: "Valerio Donati" });
        // expect(updatedUser?.canCheckIn).toBe(true);
        const response = yield (0, supertest_1.default)(server_1.app).post("/api/checkIn").send({
            name: "Valerio Donati",
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User has checked in");
        expect(response.body.user.name).toBe("Valerio Donati");
        expect(response.body.user.partySize).toBe(5);
        expect(response.body.user.canCheckIn).toBe(true);
        expect(response.body.user.status).toBe(enums_1.EnumStatus.SeatIn);
    }));
});
describe("User Details API", () => {
    it("should get a user details", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app).get("/api/user/Daniel Lizik");
        expect(response.status).toBe(200);
        expect(response.body.user.name).toBe("Daniel Lizik");
        expect(response.body.user.partySize).toBe(5);
        expect(response.body.user.status).toBe(enums_1.EnumStatus.InWaitingList);
        expect(response.body.user.waitingPosition).toBe(1);
        expect(response.body.user.canCheckIn).toBe(false);
    }));
});
