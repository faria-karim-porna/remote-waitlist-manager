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
const supertest_1 = __importDefault(require("supertest"));
const http_1 = require("http");
const server_1 = require("./server");
// Initialize the server for testing
let server;
beforeAll((done) => {
    // Create server
    server = (0, http_1.createServer)(server_1.app);
    server.listen(5000, () => {
        done();
    });
});
afterAll(() => {
    server.close();
});
describe("Backend CRUD Operations", () => {
    let createdUserId;
    // Test POST (Create)
    test("Create a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            name: "Faria Karim",
            partySize: 10,
        };
        const response = yield (0, supertest_1.default)(server).post("/api/join").send(userData).expect(201);
        console.log("response", response);
        // createdUserId = response.body._id;
        // expect(response.body.name).toBe(userData.name);
        // expect(response.body.email).toBe(userData.email);
    }));
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
