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
      const { fullName, phone, email, dob, gender, image } = req.body;
      const files = req.files as Express.Multer.File[];
      var profileImage;
      if (files[0]) {
        profileImage = files[0];
      } else {
        profileImage = image;
      }
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const updatedUser = await this.profileService.updateProfile({
        userId,
        fullName,
        phone,
        email,
        dob,
        gender,
        profileImage,
      });
      res.status(StatusCodes.OK).json(updatedUser);
      return;
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
      return;
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

      res.status(StatusCodes.BAD_REQUEST).json({ error: (error as Error).message });
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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
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

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
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
      res.status(StatusCodes.OK).json({ message: "Password updated successfully." });
      return;
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
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

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
      return;
    }
  };
}

export default JobSeekerController;
