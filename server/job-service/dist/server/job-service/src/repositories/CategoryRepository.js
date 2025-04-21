"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CategoryRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return await this.prisma.categoryType.create({
            data,
        });
    }
    async update(id, data) {
        return await this.prisma.categoryType.update({
            where: { id },
            data,
        });
    }
    async findById(id) {
        return await this.prisma.categoryType.findUnique({
            where: { id },
        });
    }
    async findAll() {
        return await this.prisma.categoryType.findMany();
    }
    async delete(id) {
        await this.prisma.categoryType.delete({
            where: { id },
        });
    }
}
exports.default = CategoryRepository;
