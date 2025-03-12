// export interface IInvitationRepository {
//   createInvitation(
//     email: string,
//     companyId: string,
//     role: string,
//     token: string
//   ): Promise<void>;
//   findInvitationByToken(
//     token: string
//   ): Promise<{ email: string; companyId: string; role: string } | null>;
//   deleteInvitation(token: string): Promise<void>;
//   findByToken(token: string): unknown;
//   create(data: {
//     email: string;
//     companyId: string;
//     role: string;
//     token: string;
//     expiredAt: Date;
//   }): unknown;
// }
