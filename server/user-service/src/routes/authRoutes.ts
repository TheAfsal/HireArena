// user-service/routes/authRoutes.ts

import { Router } from "express";
import AuthService from "@services/AuthService";
import AuthController from "@controllers/authController";
import JobSeekerRepository from "@repositories/JobSeekerRepository";
import prisma from "@config/prismaClient";
import RedisService from "@services/RedisServices";
import PasswordService from "@services/PasswordServices";
import TokenService from "@services/TokenServices";
import EmailService from "@services/EmailServices";
import CompanyRepository from "@repositories/CompanyRepository";
import CompanyEmployeeRoleRepository from "@repositories/CompanyEmployeeRepository";
import EmployeeRepository from "@repositories/EmployeeRepository";
import InvitationService from "@services/InvitationService";
import CompanyController from "@controllers/companyController";
import InvitationRepository from "@repositories/InvitationRepository";
import AdminRepository from "@repositories/AdminRepository";
import ProfileService from "@services/ProfileService";
import CompanyService from "@services/CompanyServices";
import passport from "passport";
import jwt from "jsonwebtoken";

interface GoogleUser {
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
}

const jobSeekerRepository = new JobSeekerRepository(prisma);
const adminRepository = new AdminRepository(prisma);
const companyRepository = new CompanyRepository(prisma);
const companyEmployeeRoleRepository = new CompanyEmployeeRoleRepository(prisma);
const employeeRepository = new EmployeeRepository(prisma);
const redisService = new RedisService();
const passwordService = new PasswordService();
const tokenService = new TokenService();
const companyService = new CompanyService(
  companyEmployeeRoleRepository,
  companyRepository
);
const emailService = new EmailService();
const invitationRepository = new InvitationRepository(prisma);

const authService = new AuthService(
  jobSeekerRepository,
  adminRepository,
  companyRepository,
  employeeRepository,
  redisService,
  emailService,
  passwordService,
  tokenService
);

const invitationService = new InvitationService(
  invitationRepository,
  companyRepository,
  employeeRepository,
  companyEmployeeRoleRepository,
  tokenService,
  passwordService,
  emailService,
  redisService
);

const profileService = new ProfileService(
  jobSeekerRepository,
  companyRepository,
  companyEmployeeRoleRepository,
  passwordService
);

const companyController = new CompanyController(
  invitationService,
  profileService,
  companyService
);

const authController = new AuthController(authService, profileService);

const router = Router();

router.post("/login", authController.login);
router.post("/company-login", authController.loginCompany);
router.post("/admin-login", authController.loginAdmin);

router.post("/signup", authController.signup);
router.post("/company-signup", authController.signupCompany);

router.post("/verify-email/:token", authController.verifyToken);

router.get("/invite/:token", companyController.invitationDetails);
router.post("/company/invite", companyController.sendInvitation);
router.post("/company/accept-invite", companyController.acceptInvitation);

router.post("/refresh-token", authController.refresh);

router.post("/refresh-token-google", authController.setRefreshForGoogle);

router.get("/who-am-i", authController.whoAmI);

router.post("/forgot-password", authController.forgotPassword);

router.post(
  "/forgot-password-token/:token",
  authController.forgotPasswordUsingToken
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONT_END_URL}/login`,
  }),

  async (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.FRONT_END_URL}/login`);
    }

    //@ts-ignore
    const userProfile = req.user as GoogleUser | null;

    if (!userProfile) {
      return res.redirect(`${process.env.FRONT_END_URL}/login`);
    }

    const email = userProfile.emails[0].value;
    const name = userProfile.displayName;

    const user = await authService.googleLogin({
      email,
      name,
      password: "123123",
    });

    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET || "",
      {
        expiresIn: "100m",
      }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, role: "HR" },
      process.env.REFRESH_TOKEN_SECRET || "",
      {
        expiresIn: "7d",
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(
      `${process.env.FRONT_END_URL}/google-login?token=${accessToken}`
    );
  }
);

export default router;
