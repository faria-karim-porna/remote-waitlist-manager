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
const WaitlistController_1 = __importDefault(require("../controllers/WaitlistController"));
const router = express_1.default.Router();
// Define routes with proper type annotations
router.post("/join", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield WaitlistController_1.default.addParty(req, res);
    }
    catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield WaitlistController_1.default.getQueue(req, res);
    }
    catch (err) {
        console.error("Error fetching queue:", err);
        res.status(500).json({ error: "Failed to fetch the waitlist queue." });
    }
}));
router.post("/checkin/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield WaitlistController_1.default.checkIn(req, res);
    }
    catch (err) {
        console.error("Error during check-in:", err);
        res.status(500).json({ error: "Failed to process check-in." });
    }
}));
exports.default = router;
