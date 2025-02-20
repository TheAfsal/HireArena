"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvitationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.invitation.create({
            data,
        });
    }
    async findByToken(token) {
        return this.prisma.invitation.findUnique({
            where: { token },
        });
    }
    async delete(token) {
        return this.prisma.invitation.delete({
            where: { token },
        });
    }
}
exports.default = InvitationRepository;
