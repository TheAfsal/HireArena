import { IUserCreateRequest } from "../types/IUserCreateRequest";
import { IJobSeeker } from "./IJobSeeker";

export interface IJobSeekerRepository {
  findById(userId: string): Promise<IJobSeeker>;
  findByEmail(email: string): Promise<IJobSeeker | null>;
  create(userData: IUserCreateRequest): Promise<IJobSeeker>;
  // Add more methods as necessary (e.g., updating job seeker details, deleting users, etc.)
}
