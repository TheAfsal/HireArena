"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JobSeekerService {
    constructor(jobSeekerRepository, redisService) {
        this.jobSeekerRepository = jobSeekerRepository;
        this.redisService = redisService;
    }
    async getAllCandidateProfile(userId) {
        throw new Error("Method not implemented.");
    }
    async toggleStatus(userId) {
        const updatedCandidate = await this.jobSeekerRepository.updateJobSeekerStatus(userId);
        if (!updatedCandidate) {
            throw new Error("User not found");
        }
        if (!updatedCandidate.status) {
            await this.redisService.delete(userId);
        }
        return updatedCandidate;
    }
}
exports.default = JobSeekerService;
