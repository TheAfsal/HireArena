import nodemailer from "nodemailer";
import { IEmailService } from "../core/interfaces/services/IEmailService";
import "colors";
import { logger } from "app";
class EmailService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ahammedijas7885@gmail.com",
        pass: "wsau wond lzgf xowd",
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      const verificationUrl = `${process.env.FRONT_END_URL}/auth/verify-email/${token}`;
      const message = `<p>Dear User,</p>

        <p>Thank you for joining <strong>HireArena</strong>! We're excited to have you on board as you take the next steps toward landing your dream job.</p>

        <p>Before you can start using all the features of our platform, we need to verify your email address. Please click the link below to confirm your email:</p>

        <p style="text-align: center; margin-top: 50px; margin-bottom: 50px;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">Verify Your Email</a>
        </p>

        <p>If you did not request this verification, please ignore this email or contact our support team at <a href="mailto:support@hirearena.com">support@hirearena.com</a>.</p>

        <p>We look forward to helping you unlock new career opportunities at <strong>HireArena</strong>!</p>

        <p>Best regards,</p>
        <p>The HireArena Team</p>

        <p style="font-size: 12px; color: #888;">If you're having trouble clicking the button, use this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
      `;

      console.log(verificationUrl);

      await this.transporter.sendMail({
        to: email,
        subject: "Email Verification",
        html: message,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendInvitationEmail(
    email: string,
    token: string,
    companyName: string,
    role: string
  ): Promise<void> {
    try {
      const invitationUrl = `${process.env.FRONT_END_URL}/auth/invitation-user/${token}`;
      const message = `
        <p>Dear Sir/Madam,</p>

        <p>You're invited to join <strong>${companyName}</strong> as a <strong>${role}</strong>! We're excited to have you on board.</p>

        <p>Before you can access the company portal and start your journey, we need to confirm your email address. Please click the link below to accept the invitation:</p>

        <p style="text-align: center; margin-top: 50px; margin-bottom: 50px;">
          <a href="${invitationUrl}" style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">Accept Invitation</a>
        </p>

        <p>If you did not request this invitation, please ignore this email or contact our support team at <a href="mailto:support@hirearena.com">support@hirearena.com</a>.</p>

        <p>We look forward to collaborating with you at <strong>${companyName}</strong>!</p>

        <p>Best regards,</p>
        <p>The HireArena Team</p>

        <p style="font-size: 12px; color: #888;">If you're having trouble clicking the button, use this link: <a href="${invitationUrl}">${invitationUrl}</a></p>
      `;

      console.log(message.bgCyan);

      await this.transporter.sendMail({
        to: email,
        subject: `Invitation to Join ${companyName} as ${role}`,
        html: message,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendPasswordChangeEmail(email: string, token: string): Promise<void> {
    try {
      const passwordChangeUrl = `${process.env.FRONT_END_URL}/auth/forgot-password/${token}`;
      
      const message = `<p>Dear User</p>
    
        <p>We received a request to reset the password for your <strong>HireArena</strong> account.</p>
    
        <p>To change your password, please click the link below:</p>
    
        <p style="text-align: center; margin-top: 50px; margin-bottom: 50px;">
          <a href="${passwordChangeUrl}" style="background-color: #FF5722; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Your Password</a>
        </p>
    
        <p>If you did not request a password reset, please ignore this email or contact our support team at <a href="mailto:support@hirearena.com">support@hirearena.com</a>.</p>
    
        <p>We are committed to helping you keep your account secure!</p>
    
        <p>Best regards,</p>
        <p>The HireArena Team</p>
    
        <p style="font-size: 12px; color: #888;">If you're having trouble clicking the button, use this link: <a href="${passwordChangeUrl}">${passwordChangeUrl}</a></p>
      `;
  
      console.log(passwordChangeUrl);
  
      await this.transporter.sendMail({
        to: email,
        subject: "Password Change Request",
        html: message,
      });
    } catch (error) {
      console.error("Error sending password change email:", error);
    }
  }
  
}

export default EmailService;
