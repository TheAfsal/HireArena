"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export interface IAdmin {
//   id: string;
//   name: string;
//   email: string;
//   password?: string;
//   role: string;
// }
class AdminRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        try {
            return await this.prisma.admin.findUnique({ where: { email } });
        }
        catch (error) {
            console.error("Error finding job seeker by email:", error);
            throw new Error("Database query failed");
        }
    }
}
exports.default = AdminRepository;
