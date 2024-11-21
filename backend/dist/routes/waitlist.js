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
const express_1 = __importDefault(require("express"));
const Party_1 = __importDefault(require("../models/Party"));
const router = express_1.default.Router();
// Add party to the waitlist
router.post("/join", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, size } = req.body;
    try {
        const party = new Party_1.default({ name, size });
        yield party.save();
        res.status(201).json(party);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
// Get current waitlist
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const waitlist = yield Party_1.default.find({ status: "waiting" }).sort("createdAt");
        res.json(waitlist);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// Check-in party
router.post("/checkin/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const party = yield Party_1.default.findById(req.params.id);
        if (!party) {
            res.status(404).json({ message: "Party not found" });
            return;
        }
        party.status = "seated";
        yield party.save();
        res.json(party);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
exports.default = router;
