
export interface IJobSeekerUpdateInput {
  userId: string; 
  fullName?: string;
  email?: string;
  phone?: string;
  dob?: Date | string;
  gender?: string;
  profileImage?: Express.Multer.File; 
}

export interface IJobSeekerRepositoryInput {
  userId: string;
  fullName?: string;
  email?: string;
  phone?: string;
  dob?: Date;
  gender?: string;
  profileImage?: string; 
  status?: boolean;
}
