import { CompanyRole } from "@prisma/client";

export interface IInvitationDetails {
  email: string;
  message: string;
  role: string;
  name: string;
}
