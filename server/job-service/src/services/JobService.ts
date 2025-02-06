import JobRepository from "../repositories/JobRepository";

class JobService {
  private jobRepository: JobRepository;

  constructor() {
    this.jobRepository = new JobRepository();
  }

  async createJob(data: any) {
    if (!data.jobTitle || !data.companyId) {
      throw new Error("Job title and company ID are required.");
    }

    // Transform the data before storing it
    const jobData = {
      jobTitle: data.jobTitle,
      employmentTypes: data.employmentTypes || [],
      salaryMin: data.salaryRange?.min || 0,
      salaryMax: data.salaryRange?.max || 0,
      categories: data.categories || [],
      requiredSkills: data.requiredSkills || [],
      jobDescription: data.jobDescription,
      responsibilities: data.responsibilities,
      qualifications: data.qualifications,
      niceToHave: data.niceToHave || "",
      benefits: data.benefits || [],
      companyId: data.companyId,
    };

    return this.jobRepository.createJob(jobData);
  }
}

export default JobService;
