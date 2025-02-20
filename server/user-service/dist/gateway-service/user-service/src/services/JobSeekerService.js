"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JobSeekerService {
    constructor(jobSeekerRepository, redisService) {
        this.getAllCandidateProfile = async (userId) => {
            // let relationDetails =
            //   await this.companyEmployeeRoleRepository.findCompanyByUserId(userId);
            // // relationDetails.companyId
            // if (!relationDetails) {
            //   throw new Error("User not found in any company");
            // }
            // return await this.companyRepository.findById(relationDetails.companyId);
        };
        this.jobSeekerRepository = jobSeekerRepository;
        this.redisService = redisService;
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
