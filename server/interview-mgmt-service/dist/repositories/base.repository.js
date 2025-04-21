"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async save(entity) {
        return this.model.create(entity);
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async findOne(filter) {
        return this.model.findOne(filter).exec();
    }
    async findAll() {
        return this.model.find().exec();
    }
    async findByIdAndUpdate(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }
}
// import { IBaseRepository } from "../core/interfaces/repository/IBaseRepository";
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
exports.default = BaseRepository;
