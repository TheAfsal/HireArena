import { IJobSeekerService } from "@core/interfaces/services/IJobSeekerService";
import { IRedisService } from "@core/interfaces/services/IRedisService";
import { IJobSeekerRepository } from "@core/interfaces/repository/IJobSeekerRepository";
import { IJobSeeker } from "@shared/types/user.types";

class JobSeekerService implements IJobSeekerService {
  private jobSeekerRepository: IJobSeekerRepository;
  private redisService: IRedisService;

  constructor(
    jobSeekerRepository: IJobSeekerRepository,
    redisService: IRedisService
  ) {
    this.jobSeekerRepository = jobSeekerRepository;
    this.redisService = redisService;
  }

  async getAllCandidateProfile(userId: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async toggleStatus(userId: string): Promise<IJobSeeker> {
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
