import { CompanyRole, PrismaClient } from "@prisma/client";

class InvitationRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: {
    email: string;
    companyId: string;
    role: CompanyRole;
    token: string;
    message: string;
    expiredAt: Date;
  }) {
    return this.prisma.invitation.create({
      data,
    });
  }

  async findByToken(token: string) {
    return this.prisma.invitation.findUnique({
      where: { token },
    });
  }

  async delete(token: string) {
    return this.prisma.invitation.delete({
      where: { token },
    });
  }
}

export default InvitationRepository;
