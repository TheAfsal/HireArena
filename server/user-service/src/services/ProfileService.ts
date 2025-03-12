import * as grpc from "@grpc/grpc-js";

import grpcClient from "../config/grpcClient";
import { IPasswordService } from "../core/interfaces/services/IPasswordService";
import JobSeekerRepository from "../repositories/JobSeekerRepository";
import { IProfileService } from "@core/interfaces/services/IProfileService";
import { ICompanyRepository } from "@core/interfaces/repository/ICompanyRepository";
import { ICompanyEmployeeRoleRepository } from "@core/interfaces/repository/ICompanyEmployeeRoleRepository";
import { ICompany, IJobSeeker } from "@shared/user.types";
import { IJobSeekerUpdateInput } from "@core/types/services/IJobSeekerProfile";

class ProfileService implements IProfileService {
  private jobSeekerRepository: JobSeekerRepository;
  private companyRepository: ICompanyRepository;
  private companyEmployeeRoleRepository: ICompanyEmployeeRoleRepository;
  private passwordService: IPasswordService;

  constructor(
    jobSeekerRepository: JobSeekerRepository,
    companyRepository: ICompanyRepository,
    companyEmployeeRoleRepository: ICompanyEmployeeRoleRepository,
    passwordService: IPasswordService
  ) {
    this.jobSeekerRepository = jobSeekerRepository;
    this.companyRepository = companyRepository;
    this.companyEmployeeRoleRepository = companyEmployeeRoleRepository;
    this.passwordService = passwordService;
  }

  async updateProfile(data: IJobSeekerUpdateInput): Promise<IJobSeeker> {
    let fileUrl = "";
    if (data.profileImage?.mimetype) {
      fileUrl = await new Promise<string>((resolve, reject) => {
        grpcClient.fileServiceClient.uploadFile(
          {
            fileName: data?.profileImage?.originalname,
            fileData: data?.profileImage?.buffer,
            mimeType: data?.profileImage?.mimetype,
          },
          (err, response) => {
            if (err) reject(err);
            else resolve(response.fileUrl);
          }
        );
      });
    }

    return await this.jobSeekerRepository.updateProfile({
      ...data,
      //@ts-ignore
      profileImage: fileUrl || data.profileImage,
    });
  }

  async getProfile(
    userId: string
  ): Promise<Omit<IJobSeeker, "password" | "status" | "updatedAt"> | null> {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const userProfile = await this.jobSeekerRepository.getProfile(userId);
    if (!userProfile) {
      throw new Error("User not found.");
    }

    return userProfile;
  }

  async getMinimalProfile(
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
  > | null> {
    const profile = await this.jobSeekerRepository.getMinimalProfile(userId);
    if (!profile) {
      throw new Error("User not found");
    }
    return profile;
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<IJobSeeker> {
    const user = await this.jobSeekerRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await this.passwordService.compare(
      oldPassword,
      user.password
    );
    if (!isMatch) {
      throw new Error("Incorrect old password");
    }

    const hashedPassword = await this.passwordService.hash(newPassword);

    return await this.jobSeekerRepository.updatePassword(
      userId,
      hashedPassword
    );
  }

  async updateProfileCompany(data: any) {
    let logoUrl = "";

    if (data.logo?.mimetype) {
      logoUrl = await new Promise<string>((resolve, reject) => {
        grpcClient.fileServiceClient.uploadFile(
          {
            fileName: data.logo.originalname,
            fileData: data.logo.buffer,
            mimeType: data.logo.mimetype,
          },
          (err, response) => {
            if (err) reject(err);
            else resolve(response.fileUrl);
          }
        );
      });
    }

    let relationDetails =
      await this.companyEmployeeRoleRepository.findCompanyByUserId(
        data.companyId
      );

    if (!relationDetails) {
      throw new Error("Profile updation failed");
    }

    return await this.companyRepository.updateCompanyProfile({
      companyId: relationDetails?.companyId,
      companyName: data.companyName,
      website: data.website,
      location: data.location,
      industry: data.industry,
      foundingDay: data.foundingDay,
      foundingMonth: data.foundingMonth,
      foundingYear: data.foundingYear,
      aboutCompany: data.aboutCompany,
      jobCategories: data.jobCategories,
      logo: logoUrl || data.logo,
    });
  }

  async fetchCompanyProfile(userId: string): Promise<ICompany | null> {
    let relationDetails =
      await this.companyEmployeeRoleRepository.findCompanyByUserId(userId);
    if (!relationDetails) {
      throw new Error("User not found in any company");
    }
    return await this.companyRepository.findById(relationDetails.companyId);
  }

  async medialLinks(
    userId: string
  ): Promise<Pick<
    ICompany,
    "Youtube" | "LinkedIn" | "Facebook" | "Twitter" | "Instagram"
  > | null> {
    let relationDetails =
      await this.companyEmployeeRoleRepository.findCompanyByUserId(userId);
    if (!relationDetails) {
      throw new Error("User not found in any company");
    }
    return await this.companyRepository.findMedialLinksById(
      relationDetails.companyId
    );
  }

  async updateMediaLinks(userId: string, data: any) {
    let relationDetails =
      await this.companyEmployeeRoleRepository.findCompanyByUserId(userId);

    if (!relationDetails) {
      throw new Error("Media link updation failed");
    }

    return await this.companyRepository.updateMediaLinks(
      relationDetails.companyId,
      data
    );
  }

  async getAllProfiles(callback: grpc.sendUnaryData<any>) {
    this.jobSeekerRepository
      .getAllProfiles()
      .then((details: Omit<IJobSeeker, "password" | "phone" | "dob" | "gender" | "updatedAt">[]) => {
        if (details) {
          callback(null, { jobSeekers: details });
        } else {
          callback({
            code: grpc.status.NOT_FOUND,
            details: "User not found",
          });
        }
      })
      .catch((err: Error) => {
        callback({
          code: grpc.status.INTERNAL,
          details: err.message,
        });
      });
  }
}

export default ProfileService;
