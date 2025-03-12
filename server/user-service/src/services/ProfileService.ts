import * as grpc from "@grpc/grpc-js";

import grpcClient from "../config/grpcClient";
import { IPasswordService } from "../core/interfaces/services/IPasswordService";
import JobSeekerRepository from "../repositories/JobSeekerRepository";
import { IProfileService } from "@core/interfaces/services/IProfileService";

class ProfileService implements IProfileService {
  private JobSeekerRepository: JobSeekerRepository;
  private companyRepository: any;
  private companyEmployeeRoleRepository: any;
  private passwordService: IPasswordService;

  constructor(
    JobSeekerRepository: JobSeekerRepository,
    companyRepository: any,
    companyEmployeeRoleRepository: any,
    passwordService: IPasswordService
  ) {
    this.JobSeekerRepository = JobSeekerRepository;
    this.companyRepository = companyRepository;
    this.companyEmployeeRoleRepository = companyEmployeeRoleRepository;
    this.passwordService = passwordService;
  }
  async updateProfile(data: any) {
    let fileUrl = "";
    if (data.profileImage.mimetype) {
      console.log(data);

      fileUrl = await new Promise((resolve, reject) => {
        grpcClient.fileServiceClient.uploadFile(
          {
            fileName: data.profileImage.originalname,
            fileData: data.profileImage.buffer,
            mimeType: data.profileImage.mimetype,
          },
          //@ts-ignore
          (err, response) => {
            if (err) reject(err);
            else resolve(response.fileUrl);
          }
        );
      });
    }
    return await this.JobSeekerRepository.updateProfile({
      ...data,
      profileImage: data.profileImage.mimetype ? fileUrl : data.profileImage,
    });
  }

  async getProfile(userId: string) {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const userProfile = await this.JobSeekerRepository.getProfile(userId);
    if (!userProfile) {
      throw new Error("User not found.");
    }

    return userProfile;
  }

  async getMinimalProfile(userId: string) {
    const profile = await this.JobSeekerRepository.getMinimalProfile(userId);
    if (!profile) {
      throw new Error("User not found");
    }
    return profile;
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await this.JobSeekerRepository.findById(userId);

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

    return await this.JobSeekerRepository.updatePassword(
      userId,
      hashedPassword
    );
  }

  updateProfileCompany = async (data: any) => {
    let logoUrl = "";

    if (data.logo && data.logo.mimetype) {
      logoUrl = await new Promise<string>((resolve, reject) => {
        grpcClient.fileServiceClient.uploadFile(
          {
            fileName: data.logo.originalname,
            fileData: data.logo.buffer,
            mimeType: data.logo.mimetype,
          },
          //@ts-ignore
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

    return await this.companyRepository.updateCompanyProfile({
      companyId: relationDetails.companyId,
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
  };

  fetchCompanyProfile = async (userId: any) => {
    let relationDetails =
      await this.companyEmployeeRoleRepository.findCompanyByUserId(userId);
    // relationDetails.companyId
    if (!relationDetails) {
      throw new Error("User not found in any company");
    }
    return await this.companyRepository.findById(relationDetails.companyId);
  };

  medialLinks = async (userId: any) => {
    let relationDetails =
      await this.companyEmployeeRoleRepository.findCompanyByUserId(userId);
    if (!relationDetails) {
      throw new Error("User not found in any company");
    }
    return await this.companyRepository.findMedialLinksById(
      relationDetails.companyId
    );
  };

  updateMediaLinks = async (userId: string, data: any) => {
    let relationDetails =
      await this.companyEmployeeRoleRepository.findCompanyByUserId(userId);

    return await this.companyRepository.updateMediaLinks(
      relationDetails.companyId,
      data
    );
  };

  async getAllProfiles(callback: grpc.sendUnaryData<any>) {
    this.JobSeekerRepository.getAllProfiles()
      .then((details: any) => {
        console.log(details);

        if (details) {
          callback(null, { jobSeekers: details });
        } else {
          callback({
            code: grpc.status.NOT_FOUND,
            details: "User not found",
          });
        }
      })
      .catch((err: any) => {
        callback({
          code: grpc.status.INTERNAL,
          details: err.message,
        });
      });
  }
}

export default ProfileService;
