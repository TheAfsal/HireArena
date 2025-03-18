import { IAdminRepository } from "@core/interfaces/repository/IAdminRepository";
import { PrismaClient } from "@prisma/client";
import { TYPES } from "di/types";
import { inject, injectable } from "inversify";

@injectable()
class AdminRepository implements IAdminRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}
  
  // private prisma: PrismaClient;
  // constructor(prisma: any) {
  // this.prisma = prisma;
  // }
  // async create(data: { name: string; jobCategoryId: string; status: boolean }) {
  //   return await this.prisma.skill.create({
  //     data: {
  //       name: data.name,
  //       status: data.status,
  //       jobCategory: {
  //         connect: {
  //           id: data.jobCategoryId,
  //         },
  //       },
  //     },
  //     include: {
  //       jobCategory: {
  //         select: {
  //           name: true,
  //         },
  //       },
  //     },
  //   });
  // }
}

export default AdminRepository;
