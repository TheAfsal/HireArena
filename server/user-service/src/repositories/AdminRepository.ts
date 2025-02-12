import { PrismaClient } from "@prisma/client";
import { IJobSeekerRepository } from "../interfaces/IJobSeekerRepository";
import { IUser } from "../types/IUser";
import { IUserCreateRequest } from "../types/IUserCreateRequest";
import { IJobSeeker } from "../interfaces/IJobSeeker";

interface IAdmin {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
}

class AdminRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    try {
      return await this.prisma.admin.findUnique({ where: { email } });
    } catch (error) {
      console.error("Error finding job seeker by email:", error);
      throw new Error("Database query failed");
    }
  }
}

export default AdminRepository;
