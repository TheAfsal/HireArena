import { GetAllJobSeekers } from "@config/grpcClient";
import { IJobSeekerService } from "@core/interfaces/services/IJobSeekerService";
import { IJobSeeker } from "@core/types/subscription.types";
import AdminRepository from "@repositories/admin.repository";
import { TYPES } from "di/types";
import { inject, injectable } from "inversify";

@injectable()
class JobSeekerService implements IJobSeekerService {
  constructor(
    @inject(TYPES.AdminRepository) private adminRepository: AdminRepository
  ) {}

  async getAllCandidates(): Promise<IJobSeeker[]> {
    return await GetAllJobSeekers();
  }
}

export default JobSeekerService;
