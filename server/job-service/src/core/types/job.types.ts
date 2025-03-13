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