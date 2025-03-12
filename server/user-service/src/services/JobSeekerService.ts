import { IJobSeekerService } from "@core/interfaces/services/IJobSeekerService";
import grpcClient from "../config/grpcClient";
import { IPasswordService } from "../core/interfaces/services/IPasswordService";
import JobSeekerRepository from "../repositories/JobSeekerRepository";
import RedisService from "./RedisServices";

class JobSeekerService implements IJobSeekerService {
  private jobSeekerRepository: JobSeekerRepository;
  private redisService: any;

  constructor(
    jobSeekerRepository: JobSeekerRepository,
    redisService: RedisService
  ) {
    this.jobSeekerRepository = jobSeekerRepository;
    this.redisService = redisService;
  }

  getAllCandidateProfile = async (userId: any) => {
    // let relationDetails =
    //   await this.companyEmployeeRoleRepository.findCompanyByUserId(userId);
    // // relationDetails.companyId
    // if (!relationDetails) {
    //   throw new Error("User not found in any company");
    // }
    // return await this.companyRepository.findById(relationDetails.companyId);
  };

  async toggleStatus(userId: string): Promise<any> {
    const updatedCandidate =
      await this.jobSeekerRepository.updateJobSeekerStatus(userId);

    if (!updatedCandidate) {
      throw new Error("User not found");
    }

    if (!updatedCandidate.status) {
      await this.redisService.delete(userId);
    }

    return updatedCandidate;
  }
}

export default JobSeekerService;
