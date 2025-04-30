import { Request, Response } from "express";
import * as grpc from "@grpc/grpc-js";
import ProfileService from "@services/ProfileService";
import { IJobSeekerController } from "@core/interfaces/controllers/IJobSeekerController";
import { StatusCodes } from "http-status-codes";
class JobSeekerController implements IJobSeekerController {
  private profileService: any;

  constructor(profileService: ProfileService) {
    this.profileService = profileService;
  }

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract userId from headers
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : {};

      if (!userId) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "User ID is required" });
        return;
      }

      // Extract form data fields
      const {
        fullName,
        phone,
        email,
        dob,
        gender,
        headline,
        location,
        summary,
        yearsOfExperience,
        currentJobTitle,
        currentCompany,
        highestEducation,
        university,
        skills,
        languages,
        portfolioUrl,
        linkedinUrl,
        githubUrl,
        jobPreferences,
      } = req.body;

      // Parse JSON strings for arrays and objects
      const parsedSkills = skills ? JSON.parse(skills) : [];
      const parsedLanguages = languages ? JSON.parse(languages) : [];
      const parsedJobPreferences = jobPreferences
        ? JSON.parse(jobPreferences)
        : {};

      // Handle file uploads
      const files = req.files as Express.Multer.File[] | undefined;
      const profileImageFile =
        files?.find((file) => file.fieldname === "profileImage") || null;
      const resumeFile =
        files?.find((file) => file.fieldname === "resume") || null;
      const existingImage = req.body.image; // Existing image URL from form

      // Validate file types
      if (profileImageFile && !profileImageFile.mimetype.startsWith("image/")) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Profile image must be an image file" });
        return;
      }
      if (
        resumeFile &&
        ![
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(resumeFile.mimetype)
      ) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Resume must be a PDF or Word document" });
        return;
      }

      const updateData = {
        userId,
        fullName,
        phone,
        email,
        dob: dob ? new Date(dob) : undefined,
        gender,
        profileImage: profileImageFile || existingImage,
        headline,
        location,
        summary,
        yearsOfExperience,
        currentJobTitle,
        currentCompany,
        highestEducation,
        university,
        skills: parsedSkills,
        languages: parsedLanguages,
        portfolioUrl,
        linkedinUrl,
        githubUrl,
        resume: resumeFile,
        jobPreferences: parsedJobPreferences,
      };

      const updatedUser = await this.profileService.updateProfile(updateData);
      res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;
      const userProfile = await this.profileService.getProfile(userId);

      res.status(StatusCodes.OK).json(userProfile);
    } catch (error) {
      console.log(error);

      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: (error as Error).message });
    }
  };

  getMinimalProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const profile = await this.profileService.getMinimalProfile(userId);
      res.status(StatusCodes.OK).json(profile);
      return;
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
      return;
    }
  };

  getMiniProfileByCompany = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const profile = await this.profileService.getMinimalProfile(id);

      console.log(profile);

      res.status(StatusCodes.OK).json(profile);
      return;
    } catch (error) {
      console.log(error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
      return;
    }
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;
      const { oldPassword, newPassword } = req.body;

      console.log(oldPassword, newPassword);

      if (!oldPassword || !newPassword) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Both old and new passwords are required." });
        return;
      }

      await this.profileService.changePassword(
        userId,
        oldPassword,
        newPassword
      );
      res
        .status(StatusCodes.OK)
        .json({ message: "Password updated successfully." });
      return;
    } catch (error) {
      console.log(error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
      return;
    }
  };

  // getAllJobSeekers = async (req: Request, res: Response) => {
  //   try {
  //     const usersProfile = await this.profileService.getAllProfiles();
  //     res.status(StatusCodes.OK).json(usersProfile);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(StatusCodes.BAD_REQUEST).json({ error: (error as Error).message });
  //   }
  // };

  getAllJobSeekers = (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    this.profileService.getAllProfiles(callback);
  };

  getJobSeekerDetailsById = (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    const { ids } = call.request;
    this.profileService.getBulkProfiles(ids, callback);
  };

  getUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      res.status(StatusCodes.OK).json({ userId });
      return;
    } catch (error) {
      console.log(error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
      return;
    }
  };
}

export default JobSeekerController;
