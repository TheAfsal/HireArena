"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompanyEmployeeRoleRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // async findByUserAndCompany(userId: string, companyId: string):Promise<ICompanyEmployeeRole | null> {
    //   return this.prisma.companyEmployeeRole.findUnique({
    //     where: { userId_companyId: { userId, companyId } },
    //   });
    // }
    async findCompanyByUserId(userId) {
        return this.prisma.companyEmployeeRole.findUnique({
            where: { userId },
        });
    }
    async create(roleData) {
        return this.prisma.companyEmployeeRole.create({ data: roleData });
    }
    async updateRole(userId, companyId, role) {
        return this.prisma.companyEmployeeRole.update({
            where: { userId_companyId: { userId, companyId } },
            data: { role },
        });
    }
    async delete(userId, companyId) {
        return this.prisma.companyEmployeeRole.delete({
            where: { userId_companyId: { userId, companyId } },
        });
    }
    async fetchProfile(userId) {
        return await this.prisma.companyEmployeeRole.findUnique({
            where: { userId },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    }
    async assignRole(employeeId, companyId, role) {
        return this.prisma.companyEmployeeRole.create({
            data: {
                userId: employeeId,
                companyId: companyId,
                role: role,
            },
        });
    }
    async findEmployeesByCompanyId(companyId) {
        return this.prisma.employee
            .findMany({
            where: {
                companyAssociations: {
                    some: {
                        companyId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                companyAssociations: {
                    select: {
                        role: true,
                    },
                    where: {
                        companyId,
                    },
                    take: 1,
                },
            },
        })
            .then((employees) => employees.map((emp) => ({
            id: emp.id,
            name: emp.name,
            email: emp.email,
            role: emp.companyAssociations[0]?.role,
        })));
    }
}
exports.default = CompanyEmployeeRoleRepository;
