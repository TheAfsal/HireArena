import { ICompanyRepository } from "@core/interfaces/repository/ICompanyRepository";
import { PrismaClient, Company } from "@prisma/client";
import { ICompany } from "@shared/types/user.types";

class CompanyRepository implements ICompanyRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: string): Promise<ICompany | null> {
    return this.prisma.company.findUnique({
      where: { id },
      include: { employees: true },
    });
  }

  async findMedialLinksById(
    id: string
  ): Promise<Pick<
    ICompany,
    "Youtube" | "LinkedIn" | "Facebook" | "Twitter" | "Instagram"
  > | null> {
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

  async findByName(companyName: string): Promise<ICompany | null> {
    return this.prisma.company.findUnique({ where: { companyName } });
  }

  async create(companyData: {
    companyName: string;
    status: string;
  }): Promise<ICompany> {
    return this.prisma.company.create({ data: companyData });
  }

  async update(
    id: string,
    updateData: Partial<
      Pick<ICompany, "companyName" | "status" | "reject_reason">
    >
  ): Promise<ICompany> {
    return this.prisma.company.update({ where: { id }, data: updateData });
  }

  async delete(id: string): Promise<ICompany> {
    return this.prisma.company.delete({ where: { id } });
  }

  async updateCompanyProfile(
    data: Partial<ICompany> & { companyId: string }
  ): Promise<ICompany> {
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
        status: "Pending",
        reject_reason: "",
      },
    });
  }

  async updateMediaLinks(
    companyId: string,
    data: Partial<
      Pick<
        ICompany,
        "Youtube" | "LinkedIn" | "Facebook" | "Twitter" | "Instagram"
      >
    >
  ): Promise<ICompany> {
    return await this.prisma.company.update({
      where: { id: companyId },
      data,
    });
  }

  async findByIds(companyIds: string[]): Promise<ICompany[]> {
    try {
      if (!Array.isArray(companyIds) || companyIds.length === 0) {
        throw new Error("No company IDs provided");
      }

      return await this.prisma.company.findMany({
        where: {
          id: { in: companyIds },
        },
      });
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  }

  async findMany(
    skip: number,
    take: number,
    search: string
  ): Promise<ICompany[]> {
    return await this.prisma.company.findMany({
      skip,
      take,
      where: {
        companyName: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
  }

  async count(search: string): Promise<number> {
    return await this.prisma.company.count({
      where: {
        companyName: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
  }

  // async findMany(): Promise<ICompany[]> {
  //   return await this.prisma.company.findMany();
  // }
}

export default CompanyRepository;
