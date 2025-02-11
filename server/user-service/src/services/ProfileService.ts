import grpcClient from "../config/grpcClient";
import { IPasswordService } from "../interfaces/IPasswordService";
import JobSeekerRepository from "../repositories/JobSeekerRepository";

class ProfileService {
  private JobSeekerRepository: JobSeekerRepository;
  private passwordService: IPasswordService;

  constructor(
    JobSeekerRepository: JobSeekerRepository,
    passwordService: IPasswordService
  ) {
    this.JobSeekerRepository = JobSeekerRepository;
    this.passwordService = passwordService;
  }
  async updateProfile(data: any) {
    console.log("log from updateProfile", data);

    let fileUrl = "";
    if (data.profileImage.mimetype) {
      fileUrl = await new Promise((resolve, reject) => {
        grpcClient.uploadFile(
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

    const isMatch = await this.passwordService.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Incorrect old password");
    }

    const hashedPassword = await this.passwordService.hash(newPassword);

    return await this.JobSeekerRepository.updatePassword(userId, hashedPassword);
  }
}

export default ProfileService;
