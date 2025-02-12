import { PrismaClient, Prisma } from "@prisma/client";

class CategoryRepository {
  private prisma: PrismaClient;

  constructor(prisma: any) {
    this.prisma = prisma;
  }

  async create(data: { name: string; description: string; status: boolean }) {
    return await this.prisma.categoryType.create({
      data,
    });
  }

  async update(
    id: string,
    data: { name: string; description: string; status: boolean }
  ) {
    return await this.prisma.categoryType.update({
      where: { id },
      data,
    });
  }

  async findById(id: string) {
    return await this.prisma.categoryType.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return await this.prisma.categoryType.findMany();
  }

  async delete(id: string) {
    await this.prisma.categoryType.delete({
      where: { id },
    });
  }
}

export default CategoryRepository;
