"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpcClient_1 = require("../config/grpcClient");
const admin_repository_1 = __importDefault(require("../repositories/admin.repository"));
const types_1 = require("../di/types");
const inversify_1 = require("inversify");
let JobSeekerService = class JobSeekerService {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    // async createJob(data: any, userId: string) {
    //   var companyId;
    //   if (userId) {
    //     companyId = await getCompanyIdByUserId(userId);
    //   }
    //   console.log(data);
    //   console.log(userId);
    //   if (!data.jobTitle || !userId) {
    //     throw new Error("Job title and company ID are required.");
    //   }
    //   const job = await this.adminRepository.createJob({
    //     jobTitle: data.jobTitle,
    //     salaryMin: data.salaryRange?.min || 0,
    //     salaryMax: data.salaryRange?.max || 0,
    //     jobDescription: data.jobDescription,
    //     responsibilities: data.responsibilities,
    //     qualifications: data.qualifications,
    //     niceToHave: data.niceToHave || "",
    //     benefits: data.benefits || [],
    //     companyId,
    //     employmentTypes: {
    //       create: data.employmentTypes.map((type: string) => ({ type })),
    //     },
    //     categories: {
    //       connect: data.categories.map((categoryId: string) => ({
    //         id: categoryId, // Connect categories via their IDs
    //       })),
    //     },
    //     requiredSkills: {
    //       connect: data.requiredSkills.map((skillId: string) => ({
    //         id: skillId, // Connect skills via their IDs
    //       })),
    //     },
    //   });
    //   return job;
    // }
    async getAllCandidates() {
        return await (0, grpcClient_1.GetAllJobSeekers)();
    }
};
JobSeekerService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AdminRepository)),
    __metadata("design:paramtypes", [admin_repository_1.default])
], JobSeekerService);
exports.default = JobSeekerService;
