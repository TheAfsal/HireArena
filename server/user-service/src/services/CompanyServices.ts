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
}

export default CompanyService;
