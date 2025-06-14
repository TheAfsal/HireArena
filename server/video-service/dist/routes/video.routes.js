"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = __importDefault(require("../di/container"));
const types_1 = require("../di/types");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const videoController = container_1.default.get(types_1.TYPES.VideoController);
router.get("/", videoController.getUserConversations);
router.get("/company", videoController.getUserConversationsCompany);
exports.default = router;
