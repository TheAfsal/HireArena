export interface IJobService {
  createJob(data: any, userId: string): Promise<any>;

  getAllJobs(jobSeekerId: string): Promise<any[]>;

  getJob(id: string, jobSeekerId: string): Promise<any>;

  getAllJobsBrief(jobSeekerId: string): Promise<any[]>;

  getAllApplications(jobSeekerId: string): Promise<any[]>;

  getApplicationsStatus(
    jobSeekerId: string,
    jobId: string
  ): Promise<any>;

  applyForJob(jobId: string, jobSeekerId: string): Promise<any>;

  getFilteredJobs(filters: any, jobSeekerId: string): Promise<any[]>;

  getCompanyJobs(companyId: string): Promise<any[]>;

  fetchFilteredJobs(filters: any): Promise<any[]>;
}
