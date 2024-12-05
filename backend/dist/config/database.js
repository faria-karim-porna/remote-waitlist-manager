"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const database = () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined in the environment variables");
    }
    mongoose_1.default
        .connect(mongoUri)
        .then(() => console.log("Connected to MongoDB"))
        .catch((error) => console.log("Error connecting to MongoDB:", error));
};
exports.default = database;
