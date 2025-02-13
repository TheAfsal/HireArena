import grpcClient from "../config/grpcClient";
import { IPasswordService } from "../interfaces/IPasswordService";
import JobSeekerRepository from "../repositories/JobSeekerRepository";

class JobSeekerService {
  private JobSeekerRepository: JobSeekerRepository;

  constructor(
    JobSeekerRepository: JobSeekerRepository,
  ) {
    this.JobSeekerRepository = JobSeekerRepository;
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

}

export default JobSeekerService;
