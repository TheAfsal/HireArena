"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCall = void 0;
const mongoose_1 = require("mongoose");
const videoCallSchema = new mongoose_1.Schema({
    conversationId: { type: String, required: true, unique: true },
    participants: [{ type: String, required: true }],
    startedAt: { type: Date, default: Date.now },
});
exports.VideoCall = (0, mongoose_1.model)("VideoCall", videoCallSchema);
