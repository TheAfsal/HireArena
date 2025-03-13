import { ISkillRepository } from "@core/interfaces/repository/ISkillRepository";
import { PrismaClient, Skill } from "@prisma/client";
import { ISkill } from "@shared/job.types";

class SkillRepository implements ISkillRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: { name: string; jobCategoryId: string; status: boolean }): Promise<ISkill> {
    return await this.prisma.skill.create({
      data: {
        name: data.name,
        status: data.status,
        jobCategory: {
          connect: { id: data.jobCategoryId },
        },
      },
      include: {
        jobCategory: { select: { name: true } },
      },
    });
  }

  async update(id: string, data: { name: string; jobCategoryId: string; status: boolean }): Promise<ISkill> {
    return await this.prisma.skill.update({
      where: { id },
      data: {
        name: data.name,
        status: data.status,
        jobCategory: {
          connect: { id: data.jobCategoryId },
        },
      },
    });
  }

  async findById(id: string): Promise<ISkill | null> {
    return await this.prisma.skill.findUnique({
      where: { id },
      include: { jobCategory: true },
    });
  }

  async findAll(): Promise<{ id: string; name: string; status: boolean; jobCategory: string; createdAt: Date; modifiedAt: Date }[]> {
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
      modifiedAt: skill.modifiedAt,
    }));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.skill.delete({
      where: { id },
    });
  }
}

export default SkillRepository;
