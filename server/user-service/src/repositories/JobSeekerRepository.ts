import { PrismaClient } from "@prisma/client";
import { IUserCreateRequest } from "@core/types/IUserCreateRequest";
import { IJobSeeker } from "@shared/types/user.types";
import { IJobSeekerRepository } from "@core/interfaces/repository/IJobSeekerRepository";
import { IJobSeekerRepositoryInput } from "@core/types/services/IJobSeekerProfile";

class JobSeekerRepository implements IJobSeekerRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByEmail(email: string): Promise<IJobSeeker | null> {
    return await this.prisma.jobSeeker.findUnique({ where: { email } });
  }

  async findById(userId: string): Promise<IJobSeeker> {
    const user = await this.prisma.jobSeeker.findUnique({
      where: { id: userId },
    });
    if (!user) throw new Error("Job seeker not found");
    return user;
  }

  async create(
    userData: IUserCreateRequest
  ): Promise<Pick<IJobSeeker, "id" | "email" | "fullName">> {
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
      },
    });
  }

  async updateProfile(data: IJobSeekerRepositoryInput): Promise<IJobSeeker> {
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

  async getProfile(
    userId: string
  ): Promise<Omit<IJobSeeker, "password" | "status" | "updatedAt"> | null> {
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

  async getAllProfiles(): Promise<
    Omit<IJobSeeker, "password" | "phone" | "dob" | "gender" | "updatedAt">[]
  > {
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

  async getMinimalProfile(
    userId: string
  ): Promise<Omit<
    IJobSeeker,
    | "password"
    | "phone"
    | "dob"
    | "gender"
    | "updatedAt"
    | "status"
    | "createdAt"
  > | null> {
    return await this.prisma.jobSeeker.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        image: true,
      },
    });
  }

  async updatePassword(
    id: string,
    hashedPassword: string
  ): Promise<IJobSeeker> {
    return await this.prisma.jobSeeker.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async updateJobSeekerStatus(id: string): Promise<IJobSeeker> {
    const jobSeeker = await this.prisma.jobSeeker.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!jobSeeker) throw new Error("Job Seeker not found");
    return await this.prisma.jobSeeker.update({
      where: { id },
      data: { status: !jobSeeker.status },
    });
  }

  async getBulkProfile(userIds: string[]): Promise<IJobSeeker[]> {
    return this.prisma.jobSeeker.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
  }
  
}

export default JobSeekerRepository;
