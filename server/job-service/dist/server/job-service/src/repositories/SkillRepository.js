"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SkillRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
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
    async update(id, data) {
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
    async findById(id) {
        return await this.prisma.skill.findUnique({
            where: { id },
            include: { jobCategory: true },
        });
    }
    async findAll() {
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
    async delete(id) {
        await this.prisma.skill.delete({
            where: { id },
        });
    }
}
exports.default = SkillRepository;
