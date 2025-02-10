import JobRepository from "../repositories/JobRepository";

class JobService {
  private jobRepository: JobRepository;

  constructor(jobRepository: any) {
    this.jobRepository = jobRepository;
  }

  async createJob(data: any, companyId: string) {
    if (!data.jobTitle || !companyId) {
      throw new Error("Job title and company ID are required.");
    }

    const job = await this.jobRepository.createJob({
      jobTitle: data.jobTitle,
      salaryMin: data.salaryRange?.min || 0,
      salaryMax: data.salaryRange?.max || 0,
      jobDescription: data.jobDescription,
      responsibilities: data.responsibilities,
      qualifications: data.qualifications,
      niceToHave: data.niceToHave || "",
      benefits: data.benefits || [],
      companyId,
      employmentTypes: {
        create: data.employmentTypes.map((type: string) => ({ type })),
      },
      categories: {
        create: data.categories.map((category: string) => ({ category })),
      },
      requiredSkills: {
        create: data.requiredSkills.map((skill: string) => ({ skill })),
      },
    });

    return job;
  }

  async getAllJobs() {
    return await this.jobRepository.getAllJobs();
  }
}

export default JobService;
