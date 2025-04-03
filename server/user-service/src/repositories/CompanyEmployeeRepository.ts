import { ICompanyEmployeeRoleRepository } from "@core/interfaces/repository/ICompanyEmployeeRoleRepository";
import { PrismaClient, CompanyRole } from "@prisma/client";
import {
  ICompany,
  ICompanyEmployeeRole,
  IEmployee,
} from "@shared/types/user.types";

class CompanyEmployeeRoleRepository implements ICompanyEmployeeRoleRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // async findByUserAndCompany(userId: string, companyId: string):Promise<ICompanyEmployeeRole | null> {
  //   return this.prisma.companyEmployeeRole.findUnique({
  //     where: { userId_companyId: { userId, companyId } },
  //   });
  // }

  async findCompanyByUserId(
    userId: string
  ): Promise<ICompanyEmployeeRole | null> {
    return this.prisma.companyEmployeeRole.findUnique({
      where: { userId },
    });
  }

  async create(roleData: {
    userId: string;
    companyId: string;
    role: CompanyRole;
  }): Promise<ICompanyEmployeeRole> {
    return this.prisma.companyEmployeeRole.create({ data: roleData });
  }

  async updateRole(
    userId: string,
    companyId: string,
    role: CompanyRole
  ): Promise<ICompanyEmployeeRole> {
    return this.prisma.companyEmployeeRole.update({
      where: { userId_companyId: { userId, companyId } },
      data: { role },
    });
  }

  async delete(
    userId: string,
    companyId: string
  ): Promise<ICompanyEmployeeRole> {
    return this.prisma.companyEmployeeRole.delete({
      where: { userId_companyId: { userId, companyId } },
    });
  }

  async assignRole(
    employeeId: string,
    companyId: string,
    role: CompanyRole
  ): Promise<ICompanyEmployeeRole> {
    return this.prisma.companyEmployeeRole.create({
      data: {
        userId: employeeId,
        companyId: companyId,
        role: role,
      },
    });
  }
}

export default CompanyEmployeeRoleRepository;
