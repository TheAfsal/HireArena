import * as grpc from "@grpc/grpc-js";
import { IJobSeekerRepository } from "../interfaces/IJobSeekerRepository";
import { IRedisService } from "../interfaces/IRedisService";
import { IEmailService } from "../interfaces/IEmailService";
import { IPasswordService } from "../interfaces/IPasswordService";
import { ITokenService } from "../interfaces/ITokenService";
import CompanyRepository from "../repositories/CompanyRepository";

class CompanyService {
  private companyEmployeeRoleRepository: any;
  private redisService: any;
  private companyRepository: any;
  constructor(
    companyEmployeeRoleRepository: any,
    redisService: any,
    companyRepository: CompanyRepository
  ) {
    this.companyEmployeeRoleRepository = companyEmployeeRoleRepository;
    this.redisService = redisService;
    this.companyRepository = companyRepository;
  }

  getCompanyIdByUserId = (
    userId: string,
    callback: grpc.sendUnaryData<any>
  ) => {
    this.companyEmployeeRoleRepository
      .findCompanyByUserId(userId)
      .then((details: any) => {
        console.log(details);

        if (details.companyId) {
          callback(null, { companyId: details.companyId });
        } else {
          callback({
            code: grpc.status.NOT_FOUND,
            details: "User not found",
          });
        }
      })
      .catch((err: any) => {
        callback({
          code: grpc.status.INTERNAL,
          details: err.message,
        });
      });
  };

  async getAllCompanies(): Promise<any> {
    return await this.companyRepository.findMany();
  }

  async getCompanyDetailsById(
    companyIds: string[],
    callback: grpc.sendUnaryData<any>
  ): Promise<any> {
    this.companyRepository
      .findByIds(companyIds)
      .then((details: any) => {

        if (details) {
          console.log(details);
          
          callback(null, { companies:details });
        } else {
          callback({
            code: grpc.status.NOT_FOUND,
            details: "User not found",
          });
        }
      })
      .catch((err: any) => {
        callback({
          code: grpc.status.INTERNAL,
          details: err.message,
        });
      });
  }

  async verifyCompanyProfile(companyId: string, status: "Approved" | "Rejected", rejectReason?: string) {
    if (status === "Rejected" && !rejectReason) {
      throw new Error("Rejection reason is required when rejecting.");
    }

    return this.companyRepository.update(companyId, { status, reject_reason: rejectReason || null });
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
