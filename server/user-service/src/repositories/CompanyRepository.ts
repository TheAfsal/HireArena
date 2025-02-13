import { PrismaClient } from "@prisma/client";

class CompanyRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: { employees: true },
    });
  }

  async findMedialLinksById(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      select: {
        Youtube: true,
        LinkedIn: true,
        Facebook: true,
        Twitter: true,
        Instagram: true,
      },
    });
  }

  async findByName(companyName: string) {
    return this.prisma.company.findUnique({ where: { companyName } });
  }

  async create(companyData: { companyName: string }) {
    return this.prisma.company.create({ data: companyData });
  }

  async update(id: string, updateData: Partial<{ companyName: string }>) {
    return this.prisma.company.update({ where: { id }, data: updateData });
  }

  async delete(id: string) {
    return this.prisma.company.delete({ where: { id } });
  }

  async updateCompanyProfile(data: any) {
    console.log(data);

    return await this.prisma.company.update({
      where: { id: data.companyId },
      data: {
        companyName: data.companyName,
        website: data.website,
        location: data.location,
        employeeCount: data.employeeCount,
        industry: data.industry,
        foundingDay: data.foundingDay,
        foundingMonth: data.foundingMonth,
        foundingYear: data.foundingYear,
        aboutCompany: data.aboutCompany,
        jobCategories: data.jobCategories,
        logo: data.logo,
        updatedAt: new Date(),
      },
    });
  }

  async updateMediaLinks(companyId: string, data: any) {
    return await this.prisma.company.update({
      where: { id: companyId },
      data
    });
  }

  async findMany() {
    return await this.prisma.company.findMany();
  }
}

export default CompanyRepository;
