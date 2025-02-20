"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompanyRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        return this.prisma.company.findUnique({
            where: { id },
            include: { employees: true },
        });
    }
    async findMedialLinksById(id) {
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
    async findByName(companyName) {
        return this.prisma.company.findUnique({ where: { companyName } });
    }
    async create(companyData) {
        return this.prisma.company.create({ data: companyData });
    }
    async update(id, updateData) {
        return this.prisma.company.update({ where: { id }, data: updateData });
    }
    async delete(id) {
        return this.prisma.company.delete({ where: { id } });
    }
    async updateCompanyProfile(data) {
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
    async updateMediaLinks(companyId, data) {
        return await this.prisma.company.update({
            where: { id: companyId },
            data,
        });
    }
    async findMany() {
        return await this.prisma.company.findMany();
    }
    async findByIds(companyIds) {
        try {
            if (!Array.isArray(companyIds) || companyIds.length === 0) {
                throw new Error("No company IDs provided");
            }
            const companies = await this.prisma.company.findMany({
                where: {
                    id: {
                        in: companyIds,
                    },
                },
            });
            return companies;
        }
        catch (error) {
            console.error("Error fetching companies:", error);
            throw error;
        }
    }
}
exports.default = CompanyRepository;
