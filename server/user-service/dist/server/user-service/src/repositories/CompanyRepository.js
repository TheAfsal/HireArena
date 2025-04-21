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
                status: "Pending",
                reject_reason: "",
            },
        });
    }
    async updateMediaLinks(companyId, data) {
        return await this.prisma.company.update({
            where: { id: companyId },
            data,
        });
    }
    async findByIds(companyIds) {
        try {
            if (!Array.isArray(companyIds) || companyIds.length === 0) {
                throw new Error("No company IDs provided");
            }
            return await this.prisma.company.findMany({
                where: {
                    id: { in: companyIds },
                },
            });
        }
        catch (error) {
            console.error("Error fetching companies:", error);
            throw error;
        }
    }
    async findMany(skip, take, search) {
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
    async count(search) {
        return await this.prisma.company.count({
            where: {
                companyName: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        });
    }
}
exports.default = CompanyRepository;
