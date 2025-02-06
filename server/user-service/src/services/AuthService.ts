import { IAuthService } from "../interfaces/IAuthService";
import { IUserCreateRequest } from "../types/IUserCreateRequest";
import { IJobSeekerRepository } from "../interfaces/IJobSeekerRepository";
import { IRedisService } from "../interfaces/IRedisService";
import { IEmailService } from "../interfaces/IEmailService";
import { IPasswordService } from "../interfaces/IPasswordService";
import { ITokenService } from "../interfaces/ITokenService";
import { IJobSeeker } from "../interfaces/IJobSeeker";
import { IAuthResponse } from "../types/IAuthResponse";
import { IUser } from "../types/IUser";

class AuthService implements IAuthService {
  private jobSeekerRepository: IJobSeekerRepository;
  private companyRepository: any;
  private employeeRepository: any;
  private companyEmployeeRoleRepository: any;
  private redisService: IRedisService;
  private emailService: IEmailService;
  private passwordService: IPasswordService;
  private tokenService: ITokenService;

  constructor(
    jobSeekerRepository: IJobSeekerRepository,
    companyRepository: any,
    employeeRepository: any,
    companyEmployeeRoleRepository: any,
    redisService: IRedisService,
    emailService: IEmailService,
    passwordService: IPasswordService,
    tokenService: ITokenService
  ) {
    this.jobSeekerRepository = jobSeekerRepository;
    this.companyRepository = companyRepository;
    this.employeeRepository = employeeRepository;
    this.companyEmployeeRoleRepository = companyEmployeeRoleRepository;
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
    user: IJobSeeker;
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

      // Check if the email is already verified
      const existingUser = await this.employeeRepository.findByEmail(
        userData.email
      );

      if (existingUser) {
        throw new Error("Email already verified");
      }

      console.log(userData);

      const savedCompany = await this.companyRepository.create({
        name: userData.name,
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
      const refreshToken = this.tokenService.generateRefreshToken(savedUser.id);

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

    console.log(user);

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
    const refreshToken = this.tokenService.generateRefreshToken(user.id);

    await this.redisService.setWithTTL(
      user.email,
      refreshToken,
      7 * 24 * 60 * 60
    );

    return { tokens: { accessToken, refreshToken }, user };
  }

  async loginCompany(email: string, password: string): Promise<IAuthResponse> {
    const user: IUser | null = await this.employeeRepository.findByEmail(email);

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
    const refreshToken = this.tokenService.generateRefreshToken(user.id);

    await this.redisService.setWithTTL(
      user.email,
      refreshToken,
      7 * 24 * 60 * 60
    );

    return { tokens: { accessToken, refreshToken }, user };
  }

  // async refresh(refreshToken: string): Promise<IAuthResponse> {
  //   // Decode the refresh token
  //   const decoded = jwt.verify(
  //     refreshToken,
  //     process.env.REFRESH_TOKEN_SECRET || ""
  //   ) as jwt.JwtPayload;

  //   // Fetch the stored refresh token from the repository/database using the userId
  //   const storedToken = await this.userRepository.getRefreshToken(
  //     decoded.userId
  //   );

  //   // Validate the refresh token
  //   if (!storedToken || storedToken !== refreshToken) {
  //     throw new Error("Invalid or expired refresh token");
  //   }

  //   const tokens = this.generateTokens(decoded.userId);

  //   await this.userRepository.storeRefreshToken(
  //     decoded.userId,
  //     tokens.refreshToken
  //   );

  //   const user = await this.userRepository.findById(decoded.userId);

  //   return { tokens: tokens, user };
  // }

  // private generateTokens(userId: string) {
  //   const accessToken = jwt.sign(
  //     { userId },
  //     process.env.ACCESS_TOKEN_SECRET || "",
  //     { expiresIn: "15m" }
  //   );
  //   const refreshToken = jwt.sign(
  //     { userId },
  //     process.env.REFRESH_TOKEN_SECRET || "",
  //     { expiresIn: "7d" }
  //   );
  //   return { accessToken, refreshToken };
  // }
}

export default AuthService;
