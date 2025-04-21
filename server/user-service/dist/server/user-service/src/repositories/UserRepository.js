"use strict";
// // import { IUserRepository } from "../interfaces/IUserRepository";
// import { IUser } from "../types/IUser";
// import { IUserCreateRequest } from "../types/IUserCreateRequest";
// import redisClient from "../config/redisClient";
// import { ICompanyCreateRequest } from "../interfaces/ICompanyCreateRequest";
// import { ICompany } from "../types/ICompany";
// import { PrismaClient } from "@prisma/client";
// class UserRepository implements IUserRepository {
//   private prisma: PrismaClient;
//   constructor(prisma: PrismaClient) {
//     this.prisma = prisma;
//   }
//   async findByEmail(email: string): Promise<IUser | null> {
//     try {
//       const user = await this.prisma.jobSeeker.findUnique({
//         where: { email },
//       });
//       return user;
//     } catch (error) {
//       console.error("Error finding user by email:", error);
//       throw new Error("Database query failed");
//     }
//   }
//   async findById(userId: string): Promise<IUser> {
//     const result = await this.prisma.jobSeeker.findUnique({
//       where: {
//         id: userId,
//       },
//     });
//     if (!result) {
//       throw new Error("User not found");
//     }
//     return result;
//   }
//   async create(userData: IUserCreateRequest): Promise<IUser> {
//     try {
//       const user = await this.prisma.jobSeeker.create({
//         data: {
//           name: userData.name,
//           email: userData.email,
//           password: userData.password,
//           role: "job-seeker",
//         },
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           role: true,
//         },
//       });
//       return user;
//     } catch (error) {
//       console.error("Error creating user:", error);
//       throw new Error("Database query failed");
//     }
//   }
//   async createCompany(companyData: ICompanyCreateRequest): Promise<ICompany> {
//     try {
//       const company = await this.prisma.company.create({
//         data: {
//           name: companyData.name,
//           email: companyData.email,
//           password: companyData.password,
//           role: "company",
//         },
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           role: true,
//         },
//       });
//       return company;
//     } catch (error) {
//       console.error("Error creating company:", error);
//       throw new Error("Database query failed");
//     }
//   }
//   async findCompanyByEmail(email: string): Promise<ICompany | null> {
//     try {
//       const company = await this.prisma.company.findUnique({
//         where: { email },
//       });
//       return company;
//     } catch (error) {
//       console.error("Error finding company by email:", error);
//       throw new Error("Database query failed");
//     }
//   }
//   // Find company by ID
//   async findCompanyById(companyId: string): Promise<ICompany> {
//     const result = await this.prisma.company.findUnique({
//       where: {
//         id: companyId,
//       },
//     });
//     if (!result) {
//       throw new Error("Company not found");
//     }
//     return result;
//   }
//   async storeRefreshToken(email: string, refreshToken: string): Promise<void> {
//     await redisClient.set(email, refreshToken, "EX", 7 * 24 * 60 * 60); // Store refresh token in Redis with expiration (7 days)
//   }
//   async getRefreshToken(email: string): Promise<string | null> {
//     return await redisClient.get(email); // Get refresh token from Redis
//   }
//   async removeRefreshToken(email: string): Promise<void> {
//     await redisClient.del(email); // Remove refresh token from Redis
//   }
// }
// export default UserRepository;
