import * as grpc from "@grpc/grpc-js";
import { ICompany, IJobSeeker } from "@shared/types/user.types";
import { IJobSeekerUpdateInput } from "@core/types/services/IJobSeekerProfile";

export interface IProfileService {
  updateProfile(data: IJobSeekerUpdateInput): Promise<IJobSeeker>;

  getProfile(
    userId: string
  ): Promise<Omit<IJobSeeker, "password" | "status" | "updatedAt"> | null>;

  getMinimalProfile(
    userId: string
  ): Promise<Omit<
    IJobSeeker,
    | "password"
    | "status"
    | "updatedAt"
    | "phone"
    | "dob"
    | "gender"
    | "createdAt"
  > | null>;

  changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<IJobSeeker>;

  updateProfileCompany(data: any): Promise<any>;

  fetchCompanyProfile(userId: string): Promise<ICompany | null>;

  medialLinks(
    userId: string
  ): Promise<Pick<
    ICompany,
    "Youtube" | "LinkedIn" | "Facebook" | "Twitter" | "Instagram"
  > | null>;

  updateMediaLinks(userId: string, data: any): Promise<any>;

  getAllProfiles(callback: grpc.sendUnaryData<any>): Promise<void>;
}
