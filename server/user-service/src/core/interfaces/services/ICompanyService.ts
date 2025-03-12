import { sendUnaryData } from "@grpc/grpc-js";

export interface ICompanyService {
  getCompanyIdByUserId(userId: string, callback: sendUnaryData<any>): void;
  getAllCompanies(): Promise<any>;
  getCompanyDetailsById(companyIds: string[], callback: sendUnaryData<any>): void;
  verifyCompanyProfile(
    companyId: string,
    status: "Approved" | "Rejected",
    rejectReason?: string
  ): Promise<any>;
}

