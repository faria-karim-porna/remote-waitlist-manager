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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const usersModel_1 = require("../models/usersModel");
exports.UserRepository = {
    findByName: (name) => __awaiter(void 0, void 0, void 0, function* () { return yield usersModel_1.UsersList.findOne({ name }); }),
    findByData: (data) => __awaiter(void 0, void 0, void 0, function* () { return yield usersModel_1.UsersList.find(data); }),
    findAll: () => __awaiter(void 0, void 0, void 0, function* () { return yield usersModel_1.UsersList.find(); }),
    createUser: (data) => __awaiter(void 0, void 0, void 0, function* () { return yield new usersModel_1.UsersList(data).save(); }),
    deleteUserByName: (name) => __awaiter(void 0, void 0, void 0, function* () { return yield usersModel_1.UsersList.deleteOne({ name }); }),
    updateUser: (user) => __awaiter(void 0, void 0, void 0, function* () { return yield user.save(); }),
};
