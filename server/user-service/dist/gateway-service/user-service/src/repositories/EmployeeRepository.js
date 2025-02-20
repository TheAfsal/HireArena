"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmployeeRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        return this.prisma.employee.findUnique({ where: { email } });
    }
    async create(employeeData) {
        return this.prisma.employee.create({ data: employeeData });
    }
    async findById(id) {
        return this.prisma.employee.findUnique({ where: { id } });
    }
    async update(id, updateData) {
        return this.prisma.employee.update({ where: { id }, data: updateData });
    }
    async delete(id) {
        return this.prisma.employee.delete({ where: { id } });
    }
    async findEmployeeAndCompany(id) {
        return this.prisma.employee.findUnique({
            where: { id },
            include: {
                companyAssociations: {
                    include: {
                        company: true, // Include the related company details
                    },
                },
            },
        });
    }
}
exports.default = EmployeeRepository;
