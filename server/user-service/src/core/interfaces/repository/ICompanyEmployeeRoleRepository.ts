import { CompanyRole } from "@prisma/client";
import { ICompanyEmployeeRole } from "@shared/user.types";

export interface ICompanyEmployeeRoleRepository {
  // findByUserAndCompany(
  //   userId: string,
  //   companyId: string
  // ): Promise<ICompanyEmployeeRole | null>;

  findCompanyByUserId(userId: string): Promise<ICompanyEmployeeRole | null>;

  create(roleData: {
    userId: string;
    companyId: string;
    role: CompanyRole;
  }): Promise<ICompanyEmployeeRole>;

  updateRole(
    userId: string,
    companyId: string,
    role: CompanyRole
  ): Promise<ICompanyEmployeeRole>;

  delete(userId: string, companyId: string): Promise<ICompanyEmployeeRole>;
  
  assignRole(
    employeeId: string,
    companyId: string,
    role: CompanyRole
  ): Promise<ICompanyEmployeeRole>;
}
