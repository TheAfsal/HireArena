import { IAuthService } from "../core/interfaces/services/IAuthService";
import { IUserCreateRequest } from "../core/types/IUserCreateRequest";
import { IEmailService } from "../core/interfaces/services/IEmailService";
import { IPasswordService } from "../core/interfaces/services/IPasswordService";
import { ITokenService } from "../core/interfaces/services/ITokenService";
import { IAuthResponse } from "../core/types/IAuthResponse";
import { IUser } from "../core/types/IUser";
import { ROLES } from "../../src/constants/roles";
import { IRedisService } from "@core/interfaces/services/IRedisService";
import { IJobSeekerRepository } from "@core/interfaces/repository/IJobSeekerRepository";
import { IAdminRepository } from "@core/interfaces/repository/IAdminRepository";
import { IEmployeeRepository } from "@core/interfaces/repository/IEmployeeRepository";
import {
  IAdmin,
  IEmployee,
  IJobSeeker,
} from "@shared/types/user.types";
import { ICompanyRepository } from "@core/interfaces/repository/ICompanyRepository";

class AuthService implements IAuthService {
  private jobSeekerRepository: IJobSeekerRepository;
  private adminRepository: IAdminRepository;
  private companyRepository: ICompanyRepository;
  private employeeRepository: IEmployeeRepository;
  private redisService: IRedisService;
  private emailService: IEmailService;
  private passwordService: IPasswordService;
  private tokenService: ITokenService;

  constructor(
    jobSeekerRepository: IJobSeekerRepository,
    adminRepository: IAdminRepository,
    companyRepository: ICompanyRepository,
    employeeRepository: IEmployeeRepository,
    redisService: IRedisService,
    emailService: IEmailService,
    passwordService: IPasswordService,
    tokenService: ITokenService
  ) {
    this.jobSeekerRepository = jobSeekerRepository;
    this.adminRepository = adminRepository;
    this.companyRepository = companyRepository;
    this.employeeRepository = employeeRepository;
    this.redisService = redisService;
    this.emailService = emailService;
    this.passwordService = passwordService;
    this.tokenService = tokenService;
  }

  async signup(userData: IUserCreateRequest): Promise<{ message: string }> {
    const existingData = await this.jobSeekerRepository.findByEmail(
      userData.email
    );
    if (existingData) {
      throw new Error("Email already in use");
    }

    const redisData = await this.redisService.get(userData.email);

    if (redisData) {
      throw new Error("Email already send");
    }

    userData.password = await this.passwordService.hash(userData.password);

    const hashedEmail = this.tokenService.encrypt(
      userData.email,
      "your-secret-key"
    );

    await this.redisService.setWithTTL(
      userData.email,
      { ...userData, verified: false, accType: "job-seeker" },
      600
    );

    await this.emailService.sendVerificationEmail(userData.email, hashedEmail);

    return { message: "Verification email sent. Please check your inbox." };
  }

  async verifyToken(token: string): Promise<{
    user: IJobSeeker | IEmployee;
    accessToken: string;
    refreshToken?: string;
    role: string;
  } | null> {
    const decodedEmail = this.tokenService.decrypt(token, "your-secret-key");

    const redisData = await this.redisService.get(decodedEmail);

    if (!redisData) {
      throw new Error("Invalid or expired token");
    }

    const userData = JSON.parse(redisData);

    let savedUser;

    if (userData.accType === "company") {
      const existingCompany = await this.companyRepository.findByName(
        userData.name
      );
      if (existingCompany) {
        throw new Error("Company with this name already exists");
      }

      const existingUser = await this.employeeRepository.findByEmail(
        userData.email
      );

      if (existingUser) {
        throw new Error("Email already verified");
      }

      const savedCompany = await this.companyRepository.create({
        companyName: userData.name,
        status: "Pending",
      });

      const savedEmployee = await this.employeeRepository.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        companyAssociations: {
          create: {
            companyId: savedCompany.id,
            role: "OWNER",
          },
        },
      });

      await this.redisService.delete(userData.email);

      const accessToken = this.tokenService.generateAccessToken(
        savedEmployee.id
      );

      return {
        user: savedEmployee,
        accessToken,
        role: userData.accType,
      };
    } else {
      const existingData = await this.jobSeekerRepository.findByEmail(
        userData.email
      );

      if (existingData) {
        throw new Error("Email already verified");
      }

      savedUser = await this.jobSeekerRepository.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      await this.redisService.delete(token);

      const accessToken = this.tokenService.generateAccessToken(savedUser.id);
      const refreshToken = this.tokenService.generateRefreshToken(
        savedUser.id,
        ROLES.COMPANY
      );

      await this.redisService.setWithTTL(
        savedUser.email,
        refreshToken,
        7 * 24 * 60 * 60
      );

      return {
        user: savedUser,
        accessToken,
        refreshToken,
        role: userData.accType,
      };
    }
  }

  async signupCompany(
    userData: IUserCreateRequest
  ): Promise<{ message: string }> {
    const existingUser = await this.employeeRepository.findByEmail(
      userData.email
    );
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const existingCompany = await this.companyRepository.findByName(
      userData.name
    );
    if (existingCompany) {
      throw new Error("Company with this name already exists");
    }

    const redisData = await this.redisService.get(userData.email);

    if (redisData) {
      throw new Error("Email already send");
    }

    userData.password = await this.passwordService.hash(userData.password);

    const hashedEmail = this.tokenService.encrypt(
      userData.email,
      "your-secret-key"
    );

    await this.redisService.setWithTTL(
      userData.email,
      { ...userData, verified: false, accType: "company" },
      600
    );

    await this.emailService.sendVerificationEmail(userData.email, hashedEmail);

    return { message: "Verification email sent. Please check your inbox." };
  }

  async login(email: string, password: string): Promise<IAuthResponse> {
    const user: IUser | null = await this.jobSeekerRepository.findByEmail(
      email
    );

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await this.passwordService.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    if (user?.status === false) {
      throw new Error("Account Blocked");
    }

    const accessToken = this.tokenService.generateAccessToken(user.id);
    const refreshToken = this.tokenService.generateRefreshToken(
      user.id,
      ROLES.JOB_SEEKER
    );

    await this.redisService.setWithTTL(user.id, refreshToken, 7 * 24 * 60 * 60);

    return { tokens: { accessToken, refreshToken }, user };
  }

  async loginCompany(email: string, password: string): Promise<IAuthResponse> {
    const user: IEmployee | null = await this.employeeRepository.findByEmail(
      email
    );

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    console.log("@@ user: ", user);

    const isPasswordValid = await this.passwordService.compare(
      password,
      user.password
    );
    if (!isPasswordValid || !user?.companyAssociations)
      throw new Error("Invalid credentials");

    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user?.companyAssociations[0].role,
      user?.companyAssociations[0].companyId
    );

    const refreshToken = this.tokenService.generateRefreshToken(
      user.id,
      ROLES.COMPANY
    );

    await this.redisService.setWithTTL(user.id, refreshToken, 7 * 24 * 60 * 60);

    return { tokens: { accessToken, refreshToken }, user };
  }

  async loginAdmin(email: string, password: string): Promise<IAuthResponse> {
    const user: IAdmin | null = await this.adminRepository.findByEmail(email);

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await this.passwordService.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const accessToken = this.tokenService.generateAccessToken(user.id);
    const refreshToken = this.tokenService.generateRefreshToken(
      user.id,
      ROLES.COMPANY
    );

    await this.redisService.setWithTTL(user.id, refreshToken, 7 * 24 * 60 * 60);

    return { tokens: { accessToken, refreshToken }, user };
  }

  async forgotPassword(email: string): Promise<void> {
    const user: IUser | null = await this.jobSeekerRepository.findByEmail(
      email
    );

    if (!user) {
      throw new Error("Invalid emailId");
    }

    if (user?.status === false) {
      throw new Error("Account Blocked");
    }
    const token = this.tokenService.generateVerificationToken(user.id);

    await this.emailService.sendPasswordChangeEmail(email, token);
  }

  async forgotPasswordUsingToken(
    token: string,
    newPassword: string
  ): Promise<void> {
    const userId = this.tokenService.verifyVerificationToken(token);

    if (!userId) {
      throw new Error("User not found");
    }

    const hashedPassword = await this.passwordService.hash(newPassword);

    await this.jobSeekerRepository.updatePassword(
      userId,
      hashedPassword
    );
    return
  }

  async refresh(refreshToken: string): Promise<IAuthResponse> {
    const decoded = this.tokenService.verifyRefreshToken(refreshToken);

    if (!decoded) {
      throw new Error("Invalid or expired refresh token");
    }

    const redisData = await this.redisService.get(decoded);

    if (!redisData) {
      throw new Error("Invalid or expired refresh token");
    }

    const accessToken = this.tokenService.generateAccessToken(decoded);
    return { tokens: { accessToken } };
  }

  async setRefreshForGoogle(accessToken: string): Promise<string> {
    const decoded = this.tokenService.verifyAccessToken(accessToken);

    const refreshToken = this.tokenService.generateRefreshToken(
      decoded,
      "job-seeker"
    );
    return refreshToken;
  }

  async whoAmI(token: string): Promise<{ role: string }> {
    const decoded = this.tokenService.verifyRefreshToken(token);

    if (!decoded) {
      throw new Error("Invalid or expired refresh token");
    }

    const redisData = await this.redisService.get(decoded);

    if (!redisData) {
      throw new Error("Invalid or expired refresh token");
    }

    const accessToken = this.tokenService.generateAccessToken(decoded);
    //@ts-ignore
    return "{ tokens: { accessToken } }";
  }

  googleLogin = async (userData: {
    email: string;
    name: string;
    password: string;
  }): Promise<Pick<IJobSeeker, "id" | "email" | "fullName"> | null> => {
    const existingData = await this.jobSeekerRepository.findByEmail(
      userData.email
    );

    if (existingData) {
      return existingData;
    }

    const savedUser = await this.jobSeekerRepository.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    return savedUser;
  };
}

export default AuthService;
