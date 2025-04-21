"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("./base.repository"));
const Question_1 = __importDefault(require("../model/Question"));
class QuestionRepository extends base_repository_1.default {
    constructor(questionModel = Question_1.default) {
        super(questionModel);
    }
    async createAptitudeTest(jobId, questions) {
        return await this.save({ jobId, aptitudeQuestions: questions });
    }
    async getQuestions(jobId) {
        return await this.model.findOne({ jobId }).lean();
        // const aptitudeTemplate = await this.model.findOne({ jobId: interview.jobId }).exec();
        // if (!aptitudeTemplate) throw new Error("Aptitude test not found for this job");
        // const attemptedQuestions = await this.model.findOne({ interviewId }).exec();
        // if (attemptedQuestions) return "Aptitude test already attempted.";
    }
}
exports.default = QuestionRepository;
