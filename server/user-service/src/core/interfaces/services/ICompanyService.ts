import * as grpc from "@grpc/grpc-js";

export interface ICompanyService {
  getCompanyIdByUserId(
    userId: string,
    callback: grpc.sendUnaryData<{ companyId: string }>
  ): void;

  getAllCompanies(): Promise<any[]>;

  getCompanyDetailsById(
    companyIds: string[],
    callback: grpc.sendUnaryData<{ companies: any[] }>
  ): Promise<void>;

  verifyCompanyProfile(
    companyId: string,
    status: "Approved" | "Rejected",
    rejectReason?: string
  ): Promise<any>;
}
