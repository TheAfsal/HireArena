import { CompanyRole } from "@prisma/client";

export interface IInvitationRepository {
  create(data: {
    email: string;
    companyId: string;
    role: CompanyRole;
    token: string;
    message: string;
    expiredAt: Date;
  }): Promise<any>;
  findByToken(token: string): Promise<any | null>;
  delete(token: string): Promise<any>;
}
