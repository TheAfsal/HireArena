import {
  createAptitudeTest,
  createMachineTask,
  getCompaniesDetails,
  getCompanyIdByUserId,
} from "@config/grpcClient";
import * as grpc from "@grpc/grpc-js";
import { IJobService } from "@core/interfaces/services/IJobService";
import { IJobRepository } from "@core/interfaces/repository/IJobRepository";
import { IJobApplicationRepository } from "@core/interfaces/repository/IJobApplicationRepository";
import { IJob, IJobApplication } from "@shared/types/job.types";
import { IJobResponse } from "@core/types/job.types";

class JobService implements IJobService {
  private jobRepository: IJobRepository;
  private jobApplicationRepository: IJobApplicationRepository;

  constructor(
    jobRepository: IJobRepository,
    jobApplicationRepository: IJobApplicationRepository
  ) {
    this.jobRepository = jobRepository;
    this.jobApplicationRepository = jobApplicationRepository;
  }

  async createJob(
    data: any,
    userId: string
  ): Promise<
    Omit<
      IJob,
      "employmentTypes" | "categories" | "requiredSkills" | "applications"
    >
  > {
    const companyId = userId ? await getCompanyIdByUserId(userId) : null;

    if (!data.jobTitle || !userId || !companyId) {
      throw new Error("Job title and company ID are required.");
    }

    const testOptions: Record<string, boolean> = {
      "Aptitude Test": false,
      "Machine Task": false,
      "Technical Interview": false,
      "Behavioral Interview": false,
      "Coding Challenge": false,
    };

    data.selectedTests.forEach((test: string) => (testOptions[test] = true));

    const job = await this.jobRepository.createJob({
      jobTitle: data.jobTitle,
      salaryMin: data.salaryRange?.min || 0,
      salaryMax: data.salaryRange?.max || 0,
      jobDescription: data.jobDescription,
      location: data.location,
      responsibilities: data.responsibilities,
      qualifications: data.qualifications,
      niceToHave: data.niceToHave || "",
      benefits: data.benefits || [],
      testOptions,
      companyId,
      employmentTypes: {
        create: data.employmentTypes.map((type: string) => ({ type })),
      },
      categories: {
        connect: data.categories.map((categoryId: string) => ({
          id: categoryId,
        })),
      },
      requiredSkills: {
        connect: data.requiredSkills.map((skillId: string) => ({
          id: skillId,
        })),
      },
    });

    try {
      if (testOptions["Aptitude Test"]) {
        const interviewServerResponse = await createAptitudeTest(
          job.id,
          companyId
        );
        console.log("Aptitude Test Created:", interviewServerResponse);
      }

      // if (testOptions["Machine Task"]) {
      //   const interviewServerResponse = await createMachineTask(
      //     job.id,
      //     companyId
      //   );
      //   console.log("Machine Task Created:", interviewServerResponse);
      // }
    } catch (error) {
      console.error("Test creation failed:", error);
    }

    return job;
  }

  async getAllJobs(jobSeekerId: string): Promise<Omit<IJob, "applications">[]> {
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

  async getJob(id: string, jobSeekerId: string): Promise<any> {
    const job = await this.jobRepository.getJob(id);
    if (!job) throw new Error("Job not found");

    const companyDetails = await getCompaniesDetails([job.companyId]);
    const application = await this.jobApplicationRepository.findApplication(
      id,
      jobSeekerId
    );

    return { ...job, ...companyDetails[0], isApplied: !!application };
  }

  async getAllJobsBrief(jobSeekerId: string): Promise<any[]> {
    const jobs = await this.jobRepository.getAllJobsBrief();
    const companyIds = [...new Set(jobs.map((job) => job.companyId))];
    const companyDetails = await getCompaniesDetails(companyIds);
    const appliedJobs = await this.jobApplicationRepository.findAppliedJobs(
      jobSeekerId
    );
    const appliedJobIds = new Set(appliedJobs.map((job) => job.jobId));

    return jobs.map((job) => {
      const company = companyDetails.find((c) => c.id === job.companyId);
      return {
        ...job,
        companyName: company?.companyName || "Unknown",
        companyLocation: company?.location || null,
        companyLogo: company?.logo || null,
        isApplied: appliedJobIds.has(job.id),
      };
    });
  }

  async getAllApplications(jobSeekerId: string): Promise<any[]> {
    const applications = await this.jobApplicationRepository.findAllByJobSeeker(
      jobSeekerId
    );
    const companyIds: any[] = [
      //@ts-ignore
      ...new Set(applications.map((app) => app.job.companyId)),
    ];
    const companyDetails = await getCompaniesDetails(companyIds);

    return applications.map((app) => {
      //@ts-ignore
      const company = companyDetails.find((c) => c.id === app.job.companyId);
      return {
        //@ts-ignore
        id: app.id,
        //@ts-ignore
        jobTitle: app.job.jobTitle,
        //@ts-ignore
        jobId: app.job.id,
        //@ts-ignore
        companyId: app.job.companyId,
        companyName: company?.companyName || "Unknown",
        companyLogo: company?.logo || null,
        //@ts-ignore
        status: app.status,
        //@ts-ignore
        appliedAt: app.appliedAt,
      };
    });
  }

  async getApplicationsStatus(
    jobSeekerId: string,
    jobId: string
  ): Promise<IJobApplication> {
    const application = await this.jobApplicationRepository.findApplication(
      jobId,
      jobSeekerId
    );
    if (!application) throw new Error("Application not found");
    return application;
  }

  async applyForJob(jobId: string, jobSeekerId: string): Promise<any> {
    const jobExists = await this.jobRepository.getJobById(jobId);
    if (!jobExists) throw new Error("Job not found");

    const existingApplication =
      await this.jobApplicationRepository.findApplication(jobId, jobSeekerId);
    if (existingApplication)
      throw new Error("You have already applied for this job");

    const response = await this.jobApplicationRepository.createApplication(
      jobId,
      jobSeekerId
    );

    return jobExists?.testOptions?.["Aptitude Test"]
      ? { ...response, "Aptitude Test": true }
      : response;
  }

  // async getFilteredJobs(filters: any, jobSeekerId: string): Promise<IJob[]> {
  // const jobs = await this.jobRepository.getJobs(filters);
  // const companyIds = [...new Set(jobs.map((job) => job.companyId))] as string[];
  // const companyDetails = await getCompaniesDetails(companyIds);
  // const appliedJobs = await this.jobApplicationRepository.findAppliedJobs(jobSeekerId);
  // const appliedJobIds = new Set(appliedJobs.map((job) => job.jobId));

  // return jobs.map((job) => {
  //   const company = companyDetails.find((c) => c.id === job.companyId);
  //   return {
  //     ...job,
  //     companyName: company?.companyName || "Unknown",
  //     companyLocation: company?.location || null,
  //     companyLogo: company?.logo || null,
  //     isApplied: appliedJobIds.has(job.id),
  //   };
  // });
  // }

  async getCompanyJobs(companyId: string): Promise<IJobResponse[]> {
    return await this.jobRepository.getJobsByCompany(companyId);
  }

  async fetchFilteredJobs(filters: any): Promise<Omit<IJob, "applications">[]> {
    return await this.jobRepository.getFilteredJobs(filters);
  }

  // async getCompanyByJobId(jobId: string): JobDetails {
  //   return await this.jobRepository.getcompanyName(jobId);
  // }

  // async isJobExist(id: string) {
  //   return await this.jobRepository.getJob(id);
  // }

  isJobExist = (id: string, callback: grpc.sendUnaryData<any>): void => {
    this.jobRepository
      .getJob(id)
      .then((details: Omit<IJob, "applications"> | null) => {
        if (details) {
          callback(null, {
            job: {
              ...details,
              testOptions: JSON.stringify(details.testOptions),
            },
          });
        } else {
          callback({
            code: grpc.status.NOT_FOUND,
            details: "Job not found",
          });
        }
      })
      .catch((err: Error) => {
        callback({
          code: grpc.status.INTERNAL,
          details: err.message,
        });
      });
  };

  fetchJobDetails = (
    ids: string[],
    callback: grpc.sendUnaryData<any>
  ): void => {
    this.jobRepository
      .fetchJobsByIds(ids)
      .then((details: Omit<IJob, "applications">[]) => {
        if (details) {
          const transformedDetails = details.map((job) => ({
            ...job,
            testOptions: JSON.stringify(job.testOptions),
          }));

          callback(null, { jobs: transformedDetails });
        } else {
          callback({
            code: grpc.status.NOT_FOUND,
            details: "Job not found",
          });
        }
      })
      .catch((err: Error) => {
        callback({
          code: grpc.status.INTERNAL,
          details: err.message,
        });
      });
  };
}

export default JobService;
