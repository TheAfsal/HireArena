import * as grpc from "@grpc/grpc-js";
import { ICompanyService } from "@core/interfaces/services/ICompanyService";
import { ICompanyEmployeeRoleRepository } from "@core/interfaces/repository/ICompanyEmployeeRoleRepository";
import { ICompanyRepository } from "@core/interfaces/repository/ICompanyRepository";
import { ICompany, ICompanyEmployeeRole } from "@shared/types/user.types";

class CompanyService implements ICompanyService {
  private companyEmployeeRoleRepository: ICompanyEmployeeRoleRepository;
  private companyRepository: ICompanyRepository;

  constructor(
    companyEmployeeRoleRepository: ICompanyEmployeeRoleRepository,
    companyRepository: ICompanyRepository
  ) {
    this.companyEmployeeRoleRepository = companyEmployeeRoleRepository;
    this.companyRepository = companyRepository;
  }

  getCompanyIdByUserId = (
    userId: string,
    callback: grpc.sendUnaryData<{ companyId: string }>
  ): void => {
    this.companyEmployeeRoleRepository
      .findCompanyByUserId(userId)
      .then((details: ICompanyEmployeeRole | null) => {
        if (details) {
          callback(null, { companyId: details.companyId });
        } else {
          callback({
            code: grpc.status.NOT_FOUND,
            details: "User not found",
          });
        }
      })
      .catch((err: Error) => {
        callback({
          code: grpc.status.INTERNAL,
          details: err.message,
        });
      });
  };

  async getAllCompanies(
    skip: number,
    take: number,
    search: string
  ): Promise<ICompany[]> {
    return await this.companyRepository.findMany(skip, take, search);
  }

  async getCompaniesCount(search: string): Promise<number> {
    return await this.companyRepository.count(search);
  }

  // async getAllCompanies(): Promise<ICompany[]> {
  //   return await this.companyRepository.findMany();
  // }

  async getCompanyDetailsById(
    companyIds: string[],
    callback: grpc.sendUnaryData<{ companies: any[] }>
  ): Promise<void> {
    try {
      const details = await this.companyRepository.findByIds(companyIds);
  
      console.log("@@ ********************", details);
  
      if (!details.length) {
        return callback({
          code: grpc.status.NOT_FOUND,
          details: "Companies not found",
        });
      }
  
      const companies = details.map((company) => ({
        id: company.id,
        companyName: company.companyName,
        location: company.location,
        logo: company.logo,
      }));
  
      callback(null, { companies });
    } catch (err: any) {
      callback({
        code: grpc.status.INTERNAL,
        details: err.message,
      });
    }
  }
  

  async verifyCompanyProfile(
    companyId: string,
    status: "Approved" | "Rejected",
    rejectReason?: string
  ): Promise<ICompany> {
    if (status === "Rejected" && !rejectReason) {
      throw new Error("Rejection reason is required when rejecting.");
    }

    return this.companyRepository.update(companyId, {
      status,
      reject_reason: rejectReason || null,
    });
  }

  // getCompanyIdByUserId = (
  //   userId: string,
  //   callback: grpc.sendUnaryData<any>
  // ) => {
  //   this.companyEmployeeRoleRepository
  //     .findCompanyByUserId(userId)
  //     .then((details: any) => {
  //       console.log(details);

  //       if (details.companyId) {
  //         callback(null, { companyId: details.companyId });
  //       } else {
  //         callback({
  //           code: grpc.status.NOT_FOUND,
  //           details: "User not found",
  //         });
  //       }
  //     })
  //     .catch((err: any) => {
  //       callback({
  //         code: grpc.status.INTERNAL,
  //         details: err.message,
  //       });
  //     });
  // };
}

export default CompanyService;
