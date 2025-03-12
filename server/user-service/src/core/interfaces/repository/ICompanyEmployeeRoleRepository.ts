import { CompanyRole } from "@prisma/client";

export interface ICompanyEmployeeRoleRepository {
  findByUserAndCompany(userId: string, companyId: string): Promise<any | null>;
  findCompanyByUserId(userId: string): Promise<any | null>;
  create(roleData: {
    userId: string;
    companyId: string;
    role: CompanyRole;
  }): Promise<any>;
  updateRole(
    userId: string,
    companyId: string,
    role: CompanyRole
  ): Promise<any>;
  delete(userId: string, companyId: string): Promise<any>;
  assignRole(
    employeeId: string,
    companyId: string,
    role: CompanyRole
  ): Promise<any>;
}
