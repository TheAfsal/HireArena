import { IUserCreateRequest } from "@core/types/IUserCreateRequest";
import { IUpdateProfileRequest } from "@repositories/JobSeekerRepository";
import { IJobSeeker } from "@shared/user.types";

export interface IJobSeekerRepository {
  findByEmail(email: string): Promise<IJobSeeker | null>;
  findById(userId: string): Promise<IJobSeeker>;
  create(userData: IUserCreateRequest): Promise<Pick<IJobSeeker, "id" | "email" | "fullName">> ;
  updateProfile(data: IUpdateProfileRequest): Promise<IJobSeeker>;
  getProfile(userId: string): Promise<Omit<IJobSeeker, "password" | "status" | "updatedAt"> | null> ;
  getAllProfiles(): Promise< Omit< IJobSeeker,"password" | "phone" | "dob" | "gender" | "updatedAt" >[] > ;
  getMinimalProfile(userId: string): Promise<Omit< IJobSeeker,"password" | "phone" | "dob" | "gender" | "updatedAt" | "status" | "createdAt" > | null>;
  updatePassword(id: string, hashedPassword: string): Promise<IJobSeeker>;
  updateJobSeekerStatus(id: string): Promise<IJobSeeker>;
}