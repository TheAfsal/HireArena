"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = __importDefault(require("../di/container"));
const types_1 = require("../di/types");
const router = express_1.default.Router();
const adminController = container_1.default.get(types_1.TYPES.AdminController);
router.get("/candidates", adminController.getAllCandidates);
exports.default = router;
