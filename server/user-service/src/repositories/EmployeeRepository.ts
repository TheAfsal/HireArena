import { CompanyRole, PrismaClient } from "@prisma/client";


class EmployeeRepository {
    private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByEmail(email: string) {
    return this.prisma.employee.findUnique({ where: { email } });
  }

  async create(employeeData: { name: string; email: string; password: string }) {
    return this.prisma.employee.create({ data: employeeData });
  }

  async findById(id: string) {
    return this.prisma.employee.findUnique({ where: { id } });
  }

  async update(id: string, updateData: Partial<{ name: string; email: string; password: string }>) {
    return this.prisma.employee.update({ where: { id }, data: updateData });
  }

  async delete(id: string) {
    return this.prisma.employee.delete({ where: { id } });
  }

  async findEmployeeAndCompany(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        companyAssociations: {
          include: {
            company: true,  // Include the related company details
          },
        },
      },
    });
  }

}

export default EmployeeRepository;
