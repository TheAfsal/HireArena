import { IUserCreateRequest } from "@core/types/IUserCreateRequest";
import { IJobSeeker } from "interfaces/IJobSeeker";

export interface IJobSeekerRepository {
  findByEmail(email: string): Promise<IJobSeeker | null>;
  findById(userId: string): Promise<IJobSeeker>;
  create(userData: IUserCreateRequest): Promise<IJobSeeker>;
  updateProfile(data: any): Promise<any>;
  getProfile(userId: string): Promise<any>;
  getAllProfiles(): Promise<any[]>;
  getMinimalProfile(userId: string): Promise<any>;
  updatePassword(id: string, hashedPassword: string): Promise<any>;
  updateJobSeekerStatus(id: string): Promise<any>;
}
