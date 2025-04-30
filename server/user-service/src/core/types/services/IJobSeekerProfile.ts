
export interface IJobSeekerUpdateInput {
  userId: string;
  fullName: string;
  phone?: string;
  email: string;
  dob?: Date;
  gender?: string;
  profileImage?: File | string; 
  headline?: string;
  location?: string;
  summary?: string;
  yearsOfExperience?: string;
  currentJobTitle?: string;
  currentCompany?: string;
  highestEducation?: string;
  university?: string;
  skills?: string[];
  languages?: string[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  resume?: File; // File for new upload
  jobPreferences?: any; // JSON object
}

//@ts-ignore
export interface IJobSeekerRepositoryInput extends IJobSeekerUpdateInput {
  profileImage?: string; // URL after upload
  resume?: string; // URL after upload
}
