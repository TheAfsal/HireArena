export interface IJob {
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
  employmentTypes: IJobEmploymentType[];
  categories: IJobCategory[];
  requiredSkills: ISkill[];
  applications: IJobApplication[];
}

export interface IJobApplication {
  id: string;
  jobId: string;
  jobSeekerId: string;
  status: string;
  resumeUrl?: string | null;
  appliedAt: Date;
}

export interface IJobEmploymentType {
  id: string;
  jobId: string;
  type: string;
}

export interface IJobCategoryRelation {
  id: string;
  jobId: string;
  category: string;
}

export interface IJobSkillRelation {
  id: string;
  jobId: string;
  skill: string;
}

export interface IJobCategory {
  id: string;
  name: string;
  description: string;
  status: boolean;
  categoryTypeId: string;
}

export interface ISkill {
  id: string;
  name: string;
  status: boolean;
  jobCategoryId: string;
  createdAt: Date;
  modifiedAt: Date;
}

// export interface IJob {
//     id: string;
//     jobTitle: string;
//     jobDescription: string;
//     employmentTypes: IEmploymentType[];
//     categories: IJobCategory[];
//     level: string;
//     createdAt: Date;
//     updatedAt: Date;
//   }
  
//   export interface IEmploymentType {
//     id: string;
//     type: string;
//   }
  
//   export interface JobCategory {
//     id: string;
//     name: string;
//   }
  
//   export interface JobFilter {
//     keyword?: string;
//     type?: string;
//     category?: string;
//     level?: string;
//   }
  

export interface IJobCategory {
  id: string;
  name: string;
  description: string;
  status: boolean;
  categoryTypeId: string;
}

export interface ICategoryType {
  id: string;
  name: string;
  description: string;
  status: boolean;
  jobCategories?: IJobCategory[];
}
