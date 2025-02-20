"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JobSeekerController {
    constructor(profileService) {
        this.updateProfile = async (req, 
        //@ts-ignore
        res) => {
            try {
                const { fullName, phone, email, dob, gender, image } = req.body;
                const files = req.files;
                var profileImage;
                if (files[0]) {
                    profileImage = files[0];
                }
                else {
                    profileImage = image;
                }
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
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
                res.status(200).json(updatedUser);
                return;
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
                return;
            }
        };
        this.getProfile = async (req, res) => {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const userProfile = await this.profileService.getProfile(userId);
                res.status(200).json(userProfile);
            }
            catch (error) {
                console.log(error);
                res.status(400).json({ error: error.message });
            }
        };
        this.getMinimalProfile = async (req, res) => {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                if (!userId) {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                const profile = await this.profileService.getMinimalProfile(userId);
                res.status(200).json(profile);
                return;
            }
            catch (error) {
                res.status(500).json({ message: error.message });
                return;
            }
        };
        this.changePassword = async (req, res) => {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const { oldPassword, newPassword } = req.body;
                console.log(oldPassword, newPassword);
                if (!oldPassword || !newPassword) {
                    res
                        .status(400)
                        .json({ message: "Both old and new passwords are required." });
                    return;
                }
                await this.profileService.changePassword(userId, oldPassword, newPassword);
                res.status(200).json({ message: "Password updated successfully." });
                return;
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
                return;
            }
        };
        // getAllJobSeekers = async (req: Request, res: Response) => {
        //   try {
        //     const usersProfile = await this.profileService.getAllProfiles();
        //     res.status(200).json(usersProfile);
        //   } catch (error) {
        //     console.log(error);
        //     res.status(400).json({ error: (error as Error).message });
        //   }
        // };
        this.getAllJobSeekers = (call, callback) => {
            console.log("reaching 3");
            this.profileService.getAllProfiles(callback);
        };
        this.profileService = profileService;
    }
}
exports.default = JobSeekerController;
