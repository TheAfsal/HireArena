export interface IEmailService {
  sendVerificationEmail(to: string, verificationToken: string): Promise<void>;
  sendInvitationEmail:(email: string,token: string,companyName: string,role: string)=> Promise<void> 
}
