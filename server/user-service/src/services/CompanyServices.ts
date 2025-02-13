import * as grpc from '@grpc/grpc-js';
import { IJobSeekerRepository } from "../interfaces/IJobSeekerRepository";
import { IRedisService } from "../interfaces/IRedisService";
import { IEmailService } from "../interfaces/IEmailService";
import { IPasswordService } from "../interfaces/IPasswordService";
import { ITokenService } from "../interfaces/ITokenService";


class CompanyService  {
  private companyEmployeeRoleRepository: any;
  constructor(
    companyEmployeeRoleRepository: any,
  ) {
    this.companyEmployeeRoleRepository = companyEmployeeRoleRepository;
  }

  getCompanyIdByUserId = (
    userId: string,
    callback: grpc.sendUnaryData<any>
  ) => {
    this.companyEmployeeRoleRepository
      .findCompanyByUserId(userId)
      .then((details:any) => {
        console.log(details);
        
        if (details.companyId) {
          callback(null, { companyId:details.companyId });
        } else {
          callback({
            code: grpc.status.NOT_FOUND,
            details: 'User not found',
          });
        }
      })
      .catch((err:any) => {
        callback({
          code: grpc.status.INTERNAL,
          details: err.message,
        });
      });
  };

}

export default CompanyService;
