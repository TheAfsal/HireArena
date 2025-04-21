"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundStatus = exports.RoundType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Enums
var RoundType;
(function (RoundType) {
    RoundType["Aptitude Test"] = "Aptitude Test";
    RoundType["Machine Task"] = "Machine Task";
    RoundType["Technical Interview"] = "Technical Interview";
    RoundType["Behavioral Interview"] = "Behavioral Interview";
    RoundType["Coding Challenge"] = "Coding Challenge";
    // HR = "hr",
    // Final = "final"
})(RoundType || (exports.RoundType = RoundType = {}));
var RoundStatus;
(function (RoundStatus) {
    RoundStatus["Scheduled"] = "scheduled";
    RoundStatus["Completed"] = "completed";
    RoundStatus["Canceled"] = "canceled";
    RoundStatus["Pending"] = "pending";
    RoundStatus["Failed"] = "failed";
})(RoundStatus || (exports.RoundStatus = RoundStatus = {}));
const RoundStatusSchema = new mongoose_1.Schema({
    roundType: {
        type: String,
        // enum: Object.values(RoundType),
        required: true
    },
    status: {
        type: String,
        enum: Object.values(RoundStatus),
        required: true
    },
    aptitudeTestResultId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AptitudeTestResult',
        required: false
    },
    videoCallLink: { type: String, required: false },
    remarks: { type: String, required: false },
    scheduledInterviewId: { type: String },
    scheduledAt: { type: Date, required: false, default: Date.now },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { _id: false });
const InterviewSchema = new mongoose_1.Schema({
    jobId: { type: String, required: true },
    candidateId: { type: String, required: true, index: true },
    state: { type: [RoundStatusSchema], required: true },
    scheduledAt: { type: Date },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Interview", InterviewSchema);
