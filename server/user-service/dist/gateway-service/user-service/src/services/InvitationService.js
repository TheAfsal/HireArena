"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
class InvitationService {
    constructor(invitationRepository, companyRepository, employeeRepository, companyEmployeeRole, tokenService, passwordService, emailService, redisService) {
        this.invitationRepository = invitationRepository;
        this.companyRepository = companyRepository;
        this.employeeRepository = employeeRepository;
        this.companyEmployeeRole = companyEmployeeRole;
        this.tokenService = tokenService;
        this.passwordService = passwordService;
        this.emailService = emailService;
        this.redisService = redisService;
        this.invitationRepository = invitationRepository;
        this.companyRepository = companyRepository;
        this.employeeRepository = employeeRepository;
        this.companyEmployeeRole = companyEmployeeRole;
        this.tokenService = tokenService;
        this.passwordService = passwordService;
        this.emailService = emailService;
        this.redisService = redisService;
    }
    async sendInvitation(email, employeeId, role, message) {
        const employee = await this.employeeRepository.findEmployeeAndCompany(employeeId);
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
        console.log(token.bgGreen);
        await this.emailService.sendInvitationEmail(email, token, employee.companyAssociations[0].company.name, role);
        return "Invitation sent successfully.";
    }
    async invitationDetails(token) {
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
    async acceptInvitation(token, name, password) {
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
        await this.companyEmployeeRole.assignRole(employee.id, companyId, role);
        await this.invitationRepository.delete(token);
        const accessToken = this.tokenService.generateAccessToken(employee.id);
        const refreshToken = this.tokenService.generateRefreshToken(employee.id, role);
        await this.redisService.setWithTTL(email, refreshToken, 7 * 24 * 60 * 60);
        return {
            employee,
            accessToken,
            refreshToken,
        };
    }
}
exports.default = InvitationService;
