"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class PasswordService {
    async hash(password) {
        return await bcryptjs_1.default.hash(password, 10);
    }
    async compare(password, hash) {
        return await bcryptjs_1.default.compare(password, hash);
    }
}
exports.default = PasswordService;
