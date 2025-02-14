import {
  getCompaniesDetails,
  getCompanyIdByUserId,
} from "../config/grpcClient";
import JobApplicationRepository from "../repositories/JobApplicationRepository";
import JobRepository from "../repositories/JobRepository";

interface CompanyProfile {
  id: string;
  companyName: string;
  location: string;
  logo: string;
}

class JobService {
  private jobRepository: JobRepository;
  private jobApplicationRepository: JobApplicationRepository;

  constructor(jobRepository: any, jobApplicationRepository: any) {
    this.jobRepository = jobRepository;
    this.jobApplicationRepository = jobApplicationRepository;
  }

  async createJob(data: any, userId: string) {
    var companyId;
    if (userId) {
      companyId = await getCompanyIdByUserId(userId);
    }

    console.log(data);
    console.log(userId);

    if (!data.jobTitle || !userId) {
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
        connect: data.categories.map((categoryId: string) => ({
          id: categoryId, // Connect categories via their IDs
        })),
      },
      requiredSkills: {
        connect: data.requiredSkills.map((skillId: string) => ({
          id: skillId, // Connect skills via their IDs
        })),
      },
    });

    return job;
  }

  async getAllJobs(jobSeekerId: string) {
    const jobs = await this.jobRepository.getAllJobs();

    const appliedJobs = await this.jobApplicationRepository.findAppliedJobs(
      jobSeekerId
    );

    const appliedJobIds = new Set(appliedJobs.map((app) => app.jobId));

    return jobs.map((job) => ({
      ...job,
      isApplied: appliedJobIds.has(job.id),
    }));
  }

  async getJob(id: string, jobSeekerId: string) {
    const job = await this.jobRepository.getJob(id);
    if (!job) {
      throw new Error("Job not found");
    }

    const companyDetails = await getCompaniesDetails([job.companyId]);
    const application = await this.jobApplicationRepository.findApplication(
      id,
      jobSeekerId
    );
    const isApplied = application ? true : false;

    return { ...job, ...companyDetails[0], isApplied };
  }

  async getAllJobsBrief(jobSeekerId: string) {
    const jobs = await this.jobRepository.getAllJobsBrief();

    const companyIds = [...new Set(jobs.map((job) => job.companyId))];

    const companyDetails = await getCompaniesDetails(companyIds);

    const appliedJobs = await this.jobApplicationRepository.findAppliedJobs(
      jobSeekerId
    );
    const appliedJobIds = new Set(appliedJobs.map((job) => job.jobId));

    const jobsWithCompanyDetails = jobs.map((job) => {
      const company = companyDetails.find((c) => c.id === job.companyId);

      return {
        ...job,
        companyName: company?.companyName || "Unknown",
        companyLocation: company?.location || null,
        companyLogo: company?.logo || null,
        isApplied: appliedJobIds.has(job.id),
      };
    });

    return jobsWithCompanyDetails;
  }

  async getAllApplications(jobSeekerId: string) {
    const applications = await this.jobApplicationRepository.findAllByJobSeeker(
      jobSeekerId
    );

    const companyIds = [
      ...new Set(applications.map((app) => app.job.companyId)),
    ];

    const companyDetails = await getCompaniesDetails(companyIds);

    return applications.map((app) => {
      const company = companyDetails.find((c) => c.id === app.job.companyId);

      return {
        id: app.id,
        jobTitle: app.job.jobTitle,
        jobId: app.job.id,
        companyId: app.job.companyId,
        companyName: company?.companyName || "Unknown",
        companyLogo: company?.logo || null,
        status: app.status,
        appliedAt: app.appliedAt,
      };
    });
  }

  async applyForJob(jobId: string, jobSeekerId: string) {
    console.log(jobId);

    const jobExists = await this.jobRepository.getJobById(jobId);
    console.log(jobExists);

    if (!jobExists) {
      throw new Error("Job not found");
    }

    // Check if the user has already applied
    const existingApplication =
      await this.jobApplicationRepository.findApplication(jobId, jobSeekerId);
    if (existingApplication) {
      throw new Error("You have already applied for this job");
    }

    // Create the application
    return await this.jobApplicationRepository.createApplication(
      jobId,
      jobSeekerId
    );
  }

  async getFilteredJobs(filters: any, jobSeekerId: string) {
    const jobs = await this.jobRepository.getJobs(filters);

    console.log(jobs);

    const companyIds = [...new Set(jobs.map((job) => job.companyId))];

    const companyDetails = await getCompaniesDetails(companyIds);

    const appliedJobs = await this.jobApplicationRepository.findAppliedJobs(
      jobSeekerId
    );
    const appliedJobIds = new Set(appliedJobs.map((job) => job.jobId));

    const jobsWithCompanyDetails = jobs.map((job) => {
      const company = companyDetails.find((c) => c.id === job.companyId);

      return {
        ...job,
        companyName: company?.companyName || "Unknown",
        companyLocation: company?.location || null,
        companyLogo: company?.logo || null,
        isApplied: appliedJobIds.has(job.id),
      };
    });

    return jobsWithCompanyDetails;
    // let data = await this.jobRepository.getJobs(filters);
    // // console.log("!!!!",data);

    // const companyIds = [...new Set(data.map((d) => d.companyId))];

    // const companyDetails = await getCompaniesDetails(companyIds);

    // // console.log(companyDetails);

    // return data.map((d) => {
    //   const company = companyDetails.find((c) => c.id === d.companyId);

    //   return {
    //     id: company.id,
    //     jobTitle: d.jobTitle,
    //     jobId: d.id,
    //     companyId: d.companyId,
    //     companyName: company?.companyName || "Unknown",
    //     companyLogo: company?.logo || null,
    //   };
    // });
  }
}

export default JobService;
