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
const PartyRepository_1 = __importDefault(require("../repositories/PartyRepository"));
const server_1 = require("../server");
class WaitlistService {
    constructor(capacity) {
        this.capacity = capacity; // Total seats
        this.availableSeats = capacity; // Available seats
    }
    // Add party to the waitlist
    addParty(partyData) {
        return __awaiter(this, void 0, void 0, function* () {
            const party = yield PartyRepository_1.default.addParty(partyData);
            return party;
        });
    }
    // Check in a party and notify them via WebSocket
    checkInParty(partyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const party = yield PartyRepository_1.default.updatePartyStatus(partyId, "seated");
            if (!party)
                return null;
            this.availableSeats -= party.size;
            // Notify the party via WebSocket
            if (server_1.clientConnections[partyId]) {
                server_1.clientConnections[partyId].send(JSON.stringify({ message: "Your table is ready! Please check in." }));
            }
            // Start service countdown
            setTimeout(() => {
                this.completeService(party);
            }, party.size * 3000); // 3 seconds per person
            return party;
        });
    }
    // Complete service for a party and update available seats
    completeService(party) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.availableSeats += party.size;
            // Check for the next party in the queue
            const queue = yield this.getQueue();
            for (const nextParty of queue) {
                if (nextParty.size <= this.availableSeats) {
                    if (server_1.clientConnections[(_a = nextParty._id) !== null && _a !== void 0 ? _a : ""]) {
                        server_1.clientConnections[(_b = nextParty._id) !== null && _b !== void 0 ? _b : ""].send(JSON.stringify({ message: "Your table is ready! Please check in." }));
                    }
                    break;
                }
            }
        });
    }
    // Get the current waiting parties
    getQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PartyRepository_1.default.getWaitingParties();
        });
    }
}
exports.default = new WaitlistService(10); // Initialize with 10 seats
