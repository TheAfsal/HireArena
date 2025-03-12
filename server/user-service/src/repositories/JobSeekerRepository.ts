import { PrismaClient } from "@prisma/client";
import { IUser } from "../core/types/IUser";
import { IUserCreateRequest } from "../core/types/IUserCreateRequest";
import { IJobSeeker } from "../interfaces/IJobSeeker";
import { IJobSeekerRepository } from "@core/interfaces/repository/IJobSeekerRepository";

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
          fullName: userData.name,
          email: userData.email,
          password: userData.password,
          status: true,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          password: true,
        },
      });
    } catch (error) {
      console.error("Error creating job seeker:", error);
      throw new Error("Database query failed");
    }
  }

  async updateProfile(data: any) {
    return await this.prisma.jobSeeker.update({
      where: { id: data.userId },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        dob: data.dob,
        gender: data.gender,
        image: data.profileImage,
      },
    });
  }

  async getProfile(userId: string) {
    return await this.prisma.jobSeeker.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        dob: true,
        gender: true,
        image: true,
        createdAt: true,
      },
    });
  }

  async getAllProfiles() {
    return await this.prisma.jobSeeker.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        image: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async getMinimalProfile(userId: string) {
    return await this.prisma.jobSeeker.findUnique({
      where: { id: userId },
      select: {
        fullName: true,
        email: true,
        image: true,
      },
    });
  }

  async updatePassword(id: string, hashedPassword: string) {
    return await this.prisma.jobSeeker.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async updateJobSeekerStatus(id: string) {
    const jobSeeker = await this.prisma.jobSeeker.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!jobSeeker) {
      throw new Error("Job Seeker not found");
    }

    const updatedStatus = !jobSeeker.status;

    const updatedJobSeeker = await this.prisma.jobSeeker.update({
      where: { id },
      data: { status: updatedStatus },
    });

    return updatedJobSeeker;
  }
}

export default JobSeekerRepository;
