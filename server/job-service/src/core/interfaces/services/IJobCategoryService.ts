export interface IJobCategoryService {
  createJobCategory(
    name: string,
    description: string,
    categoryTypeId: string
  ): Promise<any>;
  updateJobCategory(
    id: string,
    name: string,
    description: string,
    status: boolean,
    categoryTypeId: string
  ): Promise<any>;
  getJobCategory(id: string): Promise<any | null>;
  getJobCategories(): Promise<any[]>;
  deleteJobCategory(id: string): Promise<void>;
}
