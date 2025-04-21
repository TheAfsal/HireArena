"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("@grpc/grpc-js"));
const grpcClient_1 = __importDefault(require("../config/grpcClient"));
class ProfileService {
    constructor(jobSeekerRepository, companyRepository, companyEmployeeRoleRepository, passwordService) {
        this.jobSeekerRepository = jobSeekerRepository;
        this.companyRepository = companyRepository;
        this.companyEmployeeRoleRepository = companyEmployeeRoleRepository;
        this.passwordService = passwordService;
    }
    async updateProfile(data) {
        let fileUrl = "";
        if (data.profileImage?.mimetype) {
            fileUrl = await new Promise((resolve, reject) => {
                grpcClient_1.default.fileServiceClient.uploadFile({
                    fileName: data?.profileImage?.originalname,
                    fileData: data?.profileImage?.buffer,
                    mimeType: data?.profileImage?.mimetype,
                }, (err, response) => {
                    if (err)
                        reject(err);
                    else
                        resolve(response.fileUrl);
                });
            });
        }
        return await this.jobSeekerRepository.updateProfile({
            ...data,
            //@ts-ignore
            profileImage: fileUrl || data.profileImage,
        });
    }
    async getProfile(userId) {
        if (!userId) {
            throw new Error("User ID is required.");
        }
        const userProfile = await this.jobSeekerRepository.getProfile(userId);
        if (!userProfile) {
            throw new Error("User not found.");
        }
        return userProfile;
    }
    async getMinimalProfile(userId) {
        const profile = await this.jobSeekerRepository.getMinimalProfile(userId);
        if (!profile) {
            throw new Error("User not found");
        }
        return profile;
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.jobSeekerRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const isMatch = await this.passwordService.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error("Incorrect old password");
        }
        const hashedPassword = await this.passwordService.hash(newPassword);
        return await this.jobSeekerRepository.updatePassword(userId, hashedPassword);
    }
    async updateProfileCompany(data) {
        let logoUrl = "";
        if (data.logo?.mimetype) {
            logoUrl = await new Promise((resolve, reject) => {
                grpcClient_1.default.fileServiceClient.uploadFile({
                    fileName: data.logo.originalname,
                    fileData: data.logo.buffer,
                    mimeType: data.logo.mimetype,
                }, (err, response) => {
                    if (err)
                        reject(err);
                    else
                        resolve(response.fileUrl);
                });
            });
        }
        let relationDetails = await this.companyEmployeeRoleRepository.findCompanyByUserId(data.companyId);
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
    async fetchCompanyProfile(userId) {
        let relationDetails = await this.companyEmployeeRoleRepository.findCompanyByUserId(userId);
        if (!relationDetails) {
            throw new Error("User not found in any company");
        }
        return await this.companyRepository.findById(relationDetails.companyId);
    }
    async fetchEmployeeProfile(userId) {
        return await this.companyEmployeeRoleRepository.fetchProfile(userId);
    }
    async medialLinks(userId) {
        let relationDetails = await this.companyEmployeeRoleRepository.findCompanyByUserId(userId);
        if (!relationDetails) {
            throw new Error("User not found in any company");
        }
        return await this.companyRepository.findMedialLinksById(relationDetails.companyId);
    }
    async updateMediaLinks(userId, data) {
        let relationDetails = await this.companyEmployeeRoleRepository.findCompanyByUserId(userId);
        if (!relationDetails) {
            throw new Error("Media link updation failed");
        }
        return await this.companyRepository.updateMediaLinks(relationDetails.companyId, data);
    }
    async getAllProfiles(callback) {
        this.jobSeekerRepository
            .getAllProfiles()
            .then((details) => {
            if (details) {
                callback(null, { jobSeekers: details });
            }
            else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "User not found",
                });
            }
        })
            .catch((err) => {
            callback({
                code: grpc.status.INTERNAL,
                details: err.message,
            });
        });
    }
}
exports.default = ProfileService;
