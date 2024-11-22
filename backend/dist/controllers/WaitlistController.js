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
const WaitlistService_1 = __importDefault(require("../services/WaitlistService"));
// Define the WaitlistController class
class WaitlistController {
    // Add party to the waitlist
    addParty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const party = yield WaitlistService_1.default.addParty(req.body);
                res.status(201).json(party);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    // Get the current waitlist (queue)
    getQueue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const queue = yield WaitlistService_1.default.getQueue();
            res.json(queue);
        });
    }
    // Check-in a party and mark them as seated
    checkIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const party = yield WaitlistService_1.default.checkInParty(req.params.id);
                res.json(party);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.default = new WaitlistController();
