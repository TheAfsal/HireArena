import { IJobCategoryRepository } from "@core/interfaces/repository/IJobCategoryRepository";
import { PrismaClient } from "@prisma/client";
import { ICategoryType, IJobCategory } from "@shared/types/job.types";

// export interface IJobCategoryRepository {
//   create(data: {
//     name: string;
//     description: string;
//     categoryTypeId: string;
//     status: boolean;
//   }): Promise<IJobCategory & { categoryType: ICategoryType }>;

//   update(
//     id: string,
//     data: {
//       name: string;
//       description: string;
//       status: boolean;
//       categoryTypeId: string;
//     }
//   ): Promise<{
//     id: string;
//     name: string;
//     description: string;
//     status: boolean;
//     categoryType: string;
//   }>;

//   findById(id: string): Promise<IJobCategory | null>;

//   findAll(): Promise<
//     {
//       id: string;
//       name: string;
//       description: string;
//       status: boolean;
//       categoryType: string;
//     }[]
//   >;

//   delete(id: string): Promise<void>;
// }

class JobCategoryRepository implements IJobCategoryRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: {
    name: string;
    description: string;
    categoryTypeId: string;
    status: boolean;
  }): Promise<Omit<IJobCategory, "jobs" | "skills">> {
    return await this.prisma.jobCategory.create({
      data,
      include: {
        categoryType: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      name: string;
      description: string;
      status: boolean;
      categoryTypeId: string;
    }
  ): Promise<{
    id: string;
    name: string;
    description: string;
    status: boolean;
    categoryType: string;
  }> {
    const updatedJobCategory = await this.prisma.jobCategory.update({
      where: { id },
      data,
      include: {
        categoryType: true,
      },
    });

    return {
      id: updatedJobCategory.id,
      name: updatedJobCategory.name,
      description: updatedJobCategory.description,
      status: updatedJobCategory.status,
      categoryType: updatedJobCategory.categoryType.name,
    };
  }

  async findById(
    id: string
  ): Promise<Omit<IJobCategory, "categoryType" | "jobs" | "skills"> | null> {
    return await this.prisma.jobCategory.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<
    {
      id: string;
      name: string;
      description: string;
      status: boolean;
      categoryType: string;
    }[]
  > {
    const jobCategories = await this.prisma.jobCategory.findMany({
      include: {
        categoryType: true,
      },
    });

    return jobCategories.map((jobCategory) => ({
      id: jobCategory.id,
      name: jobCategory.name,
      description: jobCategory.description,
      status: jobCategory.status,
      categoryType: jobCategory.categoryType.name,
    }));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.jobCategory.delete({
      where: { id },
    });
  }
}

export default JobCategoryRepository;
