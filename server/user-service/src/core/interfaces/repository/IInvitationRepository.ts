import { IInvitation } from "@core/types/repository/schema.types";

export interface IInvitationRepository {
  create(data: {
    email: string;
    companyId: string;
    role: string;
    token: string;
    message: string;
    expiredAt: Date;
  }): Promise<IInvitation>;

  findByToken(token: string): Promise<IInvitation | null>;

  delete(token: string): Promise<IInvitation>;
}
