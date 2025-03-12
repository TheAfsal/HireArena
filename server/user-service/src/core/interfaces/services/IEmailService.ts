export interface IEmailService {
  sendVerificationEmail(to: string, verificationToken: string): Promise<void>;
}
