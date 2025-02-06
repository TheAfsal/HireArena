import { PrismaClient } from "@prisma/client";
import { IJobSeekerRepository } from "../interfaces/IJobSeekerRepository";
import { IUser } from "../types/IUser";
import { IUserCreateRequest } from "../types/IUserCreateRequest";
import { IJobSeeker } from "../interfaces/IJobSeeker";

class JobSeekerRepository implements IJobSeekerRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByEmail(email: string): Promise<IJobSeeker | null> {
    try {
      return await this.prisma.jobSeeker.findUnique({ where: { email } });
    } catch (error) {
      console.error("Error finding job seeker by email:", error);
      throw new Error("Database query failed");
    }
  }

  async findById(userId: string): Promise<IJobSeeker> {
    const user = await this.prisma.jobSeeker.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("Job seeker not found");

    return user;
  }

  async create(userData: IUserCreateRequest): Promise<IJobSeeker> {
    try {
      return await this.prisma.jobSeeker.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
        },
      });
    } catch (error) {
      console.error("Error creating job seeker:", error);
      throw new Error("Database query failed");
    }
  }
}

export default JobSeekerRepository;
