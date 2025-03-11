import { GetAllJobSeekers } from "@config/grpcClient";

class JobSeekerService {
  // private adminRepository: AdminRepository;

  // constructor(adminRepository: any) {
  //   this.adminRepository = adminRepository;
  // }

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
    return await GetAllJobSeekers();
  }
}

export default JobSeekerService;
