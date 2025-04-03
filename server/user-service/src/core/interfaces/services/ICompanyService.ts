import * as grpc from "@grpc/grpc-js";
import { ICompany } from "@shared/types/user.types";

export interface ICompanyService {
  getCompanyIdByUserId(
    userId: string,
    callback: grpc.sendUnaryData<{ companyId: string }>
  ): void;

  // getAllCompanies(): Promise<any[]>;
  getAllCompanies(
    skip: number,
    take: number,
    search: string
  ): Promise<ICompany[]>;
  getCompaniesCount(search: string): Promise<number>;

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
