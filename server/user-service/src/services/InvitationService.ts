import { ITokenService } from "../core/interfaces/services/ITokenService";
import { IPasswordService } from "../core/interfaces/services/IPasswordService";
import "colors";
import { ICompanyRepository } from "@core/interfaces/repository/ICompanyRepository";
import { IInvitationRepository } from "@core/interfaces/repository/IInvitationRepository";
import { IInvitationService } from "@core/interfaces/services/IInvitationService";
import { IEmployeeRepository } from "@core/interfaces/repository/IEmployeeRepository";
import { ICompanyEmployeeRoleRepository } from "@core/interfaces/repository/ICompanyEmployeeRoleRepository";
import { IEmailService } from "@core/interfaces/services/IEmailService";
import { IRedisService } from "@core/interfaces/services/IRedisService";
import { IInvitationDetails } from "@core/types/services/IInvitationDetails";
import { CompanyRole } from "@prisma/client";
class InvitationService implements IInvitationService {
  constructor(
    private invitationRepository: IInvitationRepository,
    private companyRepository: ICompanyRepository,
    private employeeRepository: IEmployeeRepository,
    private companyEmployeeRole: ICompanyEmployeeRoleRepository,
    private tokenService: ITokenService,
    private passwordService: IPasswordService,
    private emailService: IEmailService,
    private redisService: IRedisService
  ) {}

  async sendInvitation(
    email: string,
    employeeId: string,
    role: string,
    message: string
  ): Promise<string> {
    const employee = await this.employeeRepository.findEmployeeAndCompany(
      employeeId
    );

    if (!employee) {
      throw new Error("Company not found");
    }

    const token = this.tokenService.generate();

    console.log(token.bgRed);

    await this.invitationRepository.create({
      email,
      companyId: employee.companyAssociations[0].companyId,
      role,
      token,
      message,
      expiredAt: new Date(new Date().getTime() + 3600 * 1000),
    });

    await this.emailService.sendInvitationEmail(
      email,
      token,
      employee.companyAssociations[0].company.companyName,
      role
    );

    return "Invitation sent successfully.";
  }

  async invitationDetails(token: string): Promise<IInvitationDetails> {
    const invitation = await this.invitationRepository.findByToken(token);

    if (!invitation) {
      throw new Error("Invalid token found in invitation");
    }

    const company = await this.companyRepository.findById(invitation.companyId);

    if (!company) {
      throw new Error("Company associated with the invitation not found");
    }

    const { email, message, role } = invitation;
    const { companyName } = company;

    return { email, message, role, name: companyName };
  }

  async acceptInvitation(
    token: string,
    name: string,
    password: string
  ): Promise<any> {
    const invitation = await this.invitationRepository.findByToken(token);

    console.log(invitation);

    if (!invitation || invitation.expiredAt < new Date()) {
      throw new Error("Invitation is invalid or expired");
    }

    const { email, companyId, role } = invitation;

    password = await this.passwordService.hash(password);

    const employee = await this.employeeRepository.create({
      email,
      password,
      name,
    });

    await this.companyEmployeeRole.assignRole(
      employee.id,
      companyId,
      CompanyRole[role]
    );

    await this.invitationRepository.delete(token);

    const accessToken = this.tokenService.generateAccessToken(employee.id);
    const refreshToken = this.tokenService.generateRefreshToken(
      employee.id,
      role
    );

    await this.redisService.setWithTTL(email, refreshToken, 7 * 24 * 60 * 60); 

    return {
      employee,
      accessToken,
      refreshToken,
    };
  }
}

export default InvitationService;
