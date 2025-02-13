import { PrismaClient, Prisma } from "@prisma/client";

class JobCategoryRepository {
  private prisma: PrismaClient;

  constructor(prisma: any) {
    this.prisma = prisma;
  }

  async create(data: {
    name: string;
    description: string;
    categoryTypeId: string;
    status: boolean;
  }) {
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
  ) {
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

  async findById(id: string) {
    return await this.prisma.jobCategory.findUnique({
      where: { id },
    });
  }

  async findAll() {
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

  async delete(id: string) {
    await this.prisma.jobCategory.delete({
      where: { id },
    });
  }
}

export default JobCategoryRepository;
