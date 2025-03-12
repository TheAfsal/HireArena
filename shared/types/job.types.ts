export interface Job {
    id: string;
    jobTitle: string;
    jobDescription: string;
    employmentTypes: EmploymentType[];
    categories: JobCategory[];
    level: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface EmploymentType {
    id: string;
    type: string;
  }
  
  export interface JobCategory {
    id: string;
    name: string;
  }
  
  export interface JobFilter {
    keyword?: string;
    type?: string;
    category?: string;
    level?: string;
  }
  