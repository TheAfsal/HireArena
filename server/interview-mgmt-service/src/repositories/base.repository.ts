import { Model, Document } from "mongoose";

abstract class BaseRepository<T extends Document, ID = string> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async save(entity: Partial<T>): Promise<T> {
    return this.model.create(entity);
  }

  async findById(id: ID): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: Partial<Record<keyof T, any>>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findByIdAndUpdate(id: ID, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}

// import { IBaseRepository } from "@core/interfaces/repository/IBaseRepository";
// import { PrismaClient } from "@prisma/client";

// abstract class BaseRepository<T, ID> implements IBaseRepository<T, ID> {
//   protected prisma: PrismaClient;
//   protected model: any; 

//   constructor(prisma: PrismaClient) {
//     this.prisma = prisma;
//   }

//   async save(entity: Partial<T>): Promise<T> {
//     return this.model.create({ data: entity });
//   }

//   async findById(id: ID): Promise<T | null> {
//     return this.model.findUnique({ where: { id } });
//   }

//   async findAll(): Promise<T[]> {
//     return this.model.findMany();
//   }

//   async update(id: ID, data: Partial<T>): Promise<T> {
//     return this.model.update({ where: { id }, data });
//   }

//   // Abstract method to be implemented by concrete repositories
//   protected abstract setModel(): void;
// }

export default BaseRepository;