"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("./base.repository"));
const EmployeeInterviews_1 = __importDefault(require("../model/EmployeeInterviews"));
class EmployeeInterviewsRepository extends base_repository_1.default {
    constructor() {
        super(EmployeeInterviews_1.default);
    }
    async addScheduledInterview(employeeId, scheduledInterview) {
        return this.model
            .findOneAndUpdate({ employeeId }, { $push: { interviews: scheduledInterview } }, { upsert: true, new: true })
            .exec();
    }
    async findMySchedule(employeeId) {
        const result = await this.model.findOne({ employeeId }).exec();
        return result ? result.interviews : [];
    }
    async removeScheduledInterview(employeeId, scheduledInterviewId) {
        return this.model
            .findOneAndUpdate({ employeeId }, { $pull: { interviews: { _id: scheduledInterviewId } } }, { new: true })
            .exec();
    }
}
exports.default = EmployeeInterviewsRepository;
