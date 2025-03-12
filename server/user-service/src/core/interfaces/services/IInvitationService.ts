import { IInvitationDetails } from "@core/types/services/IInvitationDetails";

export interface IInvitationService {
  sendInvitation(
    email: string,
    employeeId: string,
    role: string,
    message: string
  ): Promise<string>;

  invitationDetails(token: string): Promise<IInvitationDetails>;

  acceptInvitation(token: string, name: string, password: string): Promise<any>;
}
