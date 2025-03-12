import { ISkillRepository } from "@core/interfaces/repository/ISkillRepository";
import { PrismaClient, Prisma, Skill } from "@prisma/client";

class SkillRepository implements ISkillRepository {
  private prisma: PrismaClient;

  constructor(prisma: any) {
    this.prisma = prisma;
  }

  async create(data: { name: string; jobCategoryId: string; status: boolean }) {
    return await this.prisma.skill.create({
      data: {
        name: data.name,
        status: data.status,
        jobCategory: {
          connect: {
            id: data.jobCategoryId,
          },
        },
      },
      include: {
        jobCategory: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      name: string;
      jobCategory: string;
      status: boolean;
    }
  ) {
    return await this.prisma.skill.update({
      where: { id },
      data: {
        name: data.name,
        status: data.status,
        jobCategory: {
          connect: {
            id: data.jobCategory,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.skill.findUnique({
      where: { id },
      include: {
        jobCategory: true,
      },
    });
  }

  async findAll():Promise<any> {
    const skills = await this.prisma.skill.findMany({
      include: {
        jobCategory: true,
      },
    });

    return skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      status: skill.status,
      jobCategory: skill.jobCategory.name,
      createdAt: skill.createdAt,
      modifiedAt: skill.createdAt,
    }));
  }

  async delete(id: string) {
    await this.prisma.skill.delete({
      where: { id },
    });
  }
}

export default SkillRepository;
