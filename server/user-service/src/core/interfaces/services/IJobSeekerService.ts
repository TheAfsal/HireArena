import { IJobSeeker } from "@shared/user.types";

export interface IJobSeekerService {
    getAllCandidateProfile(userId: string): Promise<any>;
    toggleStatus(userId: string): Promise<IJobSeeker>;
  }
  