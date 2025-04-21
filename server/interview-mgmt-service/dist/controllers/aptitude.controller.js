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
const grpc = __importStar(require("@grpc/grpc-js"));
class AptitudeController {
    constructor(aptitudeService) {
        this.aptitudeService = aptitudeService;
        this.CreateAptitudeTest = async (call, callback) => {
            try {
                const { jobId } = call.request;
                if (!jobId)
                    throw new Error("Missing job id");
                console.log(`Generating aptitude test for job ${jobId}...`);
                await this.aptitudeService.createAptitudeTest(jobId);
                return callback(null, { success: true });
            }
            catch (error) {
                console.error("Error creating aptitude test:", error);
                callback({
                    code: grpc.status.INTERNAL,
                });
            }
        };
        this.submitTest = async (req, res) => {
            try {
                const { interviewId, data } = req.body;
                if (!interviewId || !Array.isArray(data)) {
                    res
                        .status(400)
                        .json({ message: "Missing or invalid interviewId or data." });
                    return;
                }
                const result = await this.aptitudeService.submitTest(interviewId, data);
                res.status(200).json(result);
                return;
            }
            catch (error) {
                console.error("Error submitting aptitude test:", error);
                res.status(500).json({ message: error.message });
                return;
            }
        };
    }
}
exports.default = AptitudeController;
