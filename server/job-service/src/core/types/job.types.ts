import { EmploymentType, Prisma } from "@prisma/client";

export interface ICategoryTypeInput {
  name: string;
  description: string;
  status: boolean;
  jobCategories: { connect: { id: string }[] };
}

export interface IJobCreateInput {
  jobTitle: string;
  salaryMin: number;
  salaryMax: number;
  jobDescription: string;
  location: string;
  responsibilities: string;
  qualifications: string;
  testOptions: Prisma.JsonValue;
  niceToHave?: string | null;
  benefits: Prisma.JsonValue;
  companyId: string;
  employmentTypes: { create: { type: EmploymentType }[] };
  categories: { connect: { id: string }[] };
  requiredSkills: { connect: { id: string }[] };
}

export interface IJobResponse {
  id: string;
  jobTitle: string;
  salaryMin: number;
  salaryMax: number;
  jobDescription: string;
  responsibilities: string;
  qualifications: string;
  testOptions: any;
  niceToHave?: string | null;
  benefits: any;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  employmentTypes: {
    id: string;
    jobId: string;
    type: string;
  }[];
  categories: {
    name: string;
  }[];
  requiredSkills: {
    name: string;
  }[];
}

export interface ServerJobData {
  id?: string;
  jobTitle?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobDescription?: string;
  location?: string;
  responsibilities?: string;
  qualifications?: string;
  niceToHave?: string;
  benefits?: { title: string; description: string; icon: string }[];
  employmentTypes?: { type: string }[];
  categories?: { id: string }[];
  requiredSkills?: { id: string }[];
  testOptions?: { [key: string]: boolean };
}

export interface JobFilters {
  searchQuery?: string;
  type?: EmploymentType;
  category?: string;
  level?: string;
  skill?: string;
  location?: string;
  page?: string;
  pageSize?: string;
}

export interface JobFilterParams {
  page: number;
  pageSize: number;
  search: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
  status?: string;
  department?: string;
}