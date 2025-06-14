import { IInvitationRepository } from "@core/interfaces/repository/IInvitationRepository";
import { IInvitation } from "@core/types/repository/schema.types";
import { CompanyRole, PrismaClient } from "@prisma/client";

class InvitationRepository implements IInvitationRepository {
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
  }): Promise<IInvitation> {
    return this.prisma.invitation.create({
      data,
    });
  }

  async findByToken(token: string): Promise<IInvitation | null> {
    return this.prisma.invitation.findUnique({
      where: { token },
    });
  }

  async delete(token: string): Promise<IInvitation> {
    return this.prisma.invitation.delete({
      where: { token },
    });
  }
}

export default InvitationRepository;
