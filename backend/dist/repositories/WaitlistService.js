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
class WaitlistService {
    constructor(capacity) {
        this.capacity = capacity; // Total seats
        this.availableSeats = capacity; // Available seats
        this.observers = []; // Observers for real-time updates
    }
    // Add an observer for real-time updates
    addObserver(observer) {
        this.observers.push(observer);
    }
    // Notify all observers about the change in available seats
    notifyObservers() {
        this.observers.forEach((observer) => observer.update(this.availableSeats));
    }
    // Add a party to the waitlist
    addParty(partyData) {
        return __awaiter(this, void 0, void 0, function* () {
            const party = yield PartyRepository_1.default.addParty(partyData);
            return party;
        });
    }
    // Check-in a party, marking it as seated
    checkInParty(partyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const party = yield PartyRepository_1.default.updatePartyStatus(partyId, 'seated');
            this.availableSeats -= party.size;
            // Start service countdown
            setTimeout(() => {
                this.completeService(party);
            }, party.size * 3000); // 3 seconds per person
            this.notifyObservers();
            return party;
        });
    }
    // Complete service and free up seats
    completeService(party) {
        return __awaiter(this, void 0, void 0, function* () {
            this.availableSeats += party.size;
            this.notifyObservers();
        });
    }
    // Get the list of parties in the waiting queue
    getQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PartyRepository_1.default.getWaitingParties();
        });
    }
}
exports.default = new WaitlistService(10); // Initialize with 10 seats
