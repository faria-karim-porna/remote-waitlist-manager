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
const Party_1 = __importDefault(require("../models/Party"));
// Define the PartyRepository class
class PartyRepository {
    // Method to add a new party to the database
    addParty(partyData) {
        return __awaiter(this, void 0, void 0, function* () {
            const party = new Party_1.default(partyData);
            return yield party.save();
        });
    }
    // Method to get the list of parties that are waiting
    getWaitingParties() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Party_1.default.find({ status: 'waiting' }).sort('createdAt');
        });
    }
    // Method to update the status of a party (e.g., from 'waiting' to 'seated')
    updatePartyStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Party_1.default.findByIdAndUpdate(id, { status }, { new: true });
        });
    }
}
exports.default = new PartyRepository();
