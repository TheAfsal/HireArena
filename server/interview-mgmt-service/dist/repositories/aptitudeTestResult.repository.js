"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("./base.repository"));
const AptitudeTestResult_1 = __importDefault(require("../model/AptitudeTestResult"));
class AptitudeTestResultRepository extends base_repository_1.default {
    constructor(aptitudeTestResultModel = AptitudeTestResult_1.default) {
        super(aptitudeTestResultModel);
    }
    async saveResults(results) {
        return await this.save(results);
    }
}
exports.default = AptitudeTestResultRepository;
