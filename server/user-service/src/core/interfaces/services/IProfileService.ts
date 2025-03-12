import { sendUnaryData } from "@grpc/grpc-js";

  export interface IProfileService {
    updateProfile(data: any): Promise<any>;
    getProfile(userId: string): Promise<any>;
    getMinimalProfile(userId: string): Promise<any>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<any>;
    updateProfileCompany(data: any): Promise<any>;
    fetchCompanyProfile(userId: any): Promise<any>;
    medialLinks(userId: any): Promise<any>;
    updateMediaLinks(userId: string, data: any): Promise<any>;
    getAllProfiles(callback: sendUnaryData<any>): void;
  }
  
  