"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema
const partySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    size: { type: Number, required: true },
    status: { type: String, enum: ["waiting", "seated"], default: "waiting" },
    createdAt: { type: Date, default: Date.now },
});
// Define the model
const Party = mongoose_1.default.model("Party", partySchema);
exports.default = Party;
