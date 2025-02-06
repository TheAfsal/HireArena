import { PrismaClient } from "@prisma/client";


class CompanyRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: string) {
    return this.prisma.company.findUnique({ where: { id }, include: { employees: true } });
  }

  async findByName(name: string) {
    return this.prisma.company.findUnique({ where: { name } });
  }

  async create(companyData: { name: string }) {
    return this.prisma.company.create({ data: companyData });
  }

  async update(id: string, updateData: Partial<{ name: string }>) {
    return this.prisma.company.update({ where: { id }, data: updateData });
  }

  async delete(id: string) {
    return this.prisma.company.delete({ where: { id } });
  }
}

export default CompanyRepository;
