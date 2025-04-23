import { ICategoryRepository } from "@core/interfaces/repository/ICategoryRepository";
import { ICategoryTypeInput } from "@core/types/job.types";
import { PrismaClient } from "@prisma/client";
import { ICategoryType } from "@shared/types/job.types";

class CategoryRepository implements ICategoryRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: ICategoryTypeInput): Promise<ICategoryType> {
    console.log("@@ data while creating: ", data);
    return await this.prisma.categoryType.create({
      data,
    });
  }

  async update(id: string, data: ICategoryTypeInput): Promise<ICategoryType> {
    return await this.prisma.categoryType.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<ICategoryType | null> {
    return await this.prisma.categoryType.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<ICategoryType[]> {
    return await this.prisma.categoryType.findMany();
  }

  async delete(id: string): Promise<void> {
    await this.prisma.categoryType.delete({
      where: { id },
    });
  }
}

export default CategoryRepository;
