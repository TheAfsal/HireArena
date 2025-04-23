export enum UserRole {
  JOB_SEEKER = "JOB_SEEKER",
  ADMIN = "ADMIN",
  COMPANY = "COMPANY",
  EMPLOYEE = "EMPLOYEE",
}

export interface IJobSeeker {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string | null;
  dob: Date | null;
  gender: string | null;
  image: string | null;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  createdAt: Date;
}

export interface ICompany {
  id: string;
  companyName: string;
  website?: string | null;
  location?: string | null;
  employeeCount?: string | null;
  industry?: string | null;
  jobCategories: string[];
  logo?: string | null;
  foundingDay?: string | null;
  foundingMonth?: string | null;
  foundingYear?: string | null;
  aboutCompany?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  Youtube?: string | null;
  LinkedIn?: string | null;
  Facebook?: string | null;
  Twitter?: string | null;
  Instagram?: string | null;
  reject_reason?: string | null;
}

export interface IEmployee {
  id: string;
  name: string;
  email: string;
  image?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  companyAssociations?: ICompanyEmployeeRole[];
}

export interface ICompanyEmployeeRole {
  id: string;
  userId: string;
  companyId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CompanyRole {
  OWNER = "OWNER",
  HR = "HR",
  MANAGER = "MANAGER",
  INTERVIEWER = "INTERVIEWER",
  EMPLOYEE = "EMPLOYEE",
}
