"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompanyEmployeeRoleRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUserAndCompany(userId, companyId) {
        return this.prisma.companyEmployeeRole.findUnique({
            where: { userId_companyId: { userId, companyId } },
        });
    }
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
    async assignRole(employeeId, companyId, role) {
        return this.prisma.companyEmployeeRole.create({
            data: {
                userId: employeeId,
                companyId: companyId,
                role: role,
            },
        });
    }
}
exports.default = CompanyEmployeeRoleRepository;
