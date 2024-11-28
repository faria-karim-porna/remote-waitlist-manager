"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersList = void 0;
const enums_1 = require("../dataTypes/enums");
const mongoose_1 = require("mongoose");
const usersListSchema = new mongoose_1.Schema({
    name: String,
    partySize: Number,
    status: { type: String, enum: Object.values(enums_1.EnumStatus), default: enums_1.EnumStatus.None },
    joinedAt: { type: Date, default: Date.now },
    canCheckIn: { type: Boolean, default: false },
});
exports.UsersList = (0, mongoose_1.model)("UsersList", usersListSchema);
