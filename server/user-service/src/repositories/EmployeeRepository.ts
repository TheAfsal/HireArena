import {
  IEmployeeCreateInput,
  IEmployeeRepository,
} from "@core/interfaces/repository/IEmployeeRepository";
import { PrismaClient } from "@prisma/client";
import { ICompany, IEmployee } from "@shared/types/user.types";

class EmployeeRepository implements IEmployeeRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByEmail(email: string): Promise<IEmployee | null> {
    return this.prisma.employee.findUnique({
      where: { email },
      include: {
        companyAssociations: true,
      },
    });
  }

  async create(employeeData: IEmployeeCreateInput): Promise<IEmployee> {
    return this.prisma.employee.create({ data: employeeData });
  }

  async findById(id: string): Promise<IEmployee | null> {
    return this.prisma.employee.findUnique({ where: { id } });
  }

  async update(
    id: string,
    updateData: Partial<{ name: string; email: string; password: string }>
  ): Promise<IEmployee> {
    return this.prisma.employee.update({ where: { id }, data: updateData });
  }

  async delete(id: string): Promise<IEmployee> {
    return this.prisma.employee.delete({ where: { id } });
  }

  async findEmployeeAndCompany(
    id: string
  ): Promise<
    (IEmployee & { companyAssociations: { company: ICompany }[] }) | null
  > {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        companyAssociations: {
          include: {
            company: true,
          },
        },
      },
    });
  }
}

export default EmployeeRepository;
