"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class PrismaDatabaseClient {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async findUnique(query) {
        return await this.prisma.jobSeeker.findUnique(query);
    }
    async create(data) {
        return await this.prisma.jobSeeker.create(data);
    }
    async findMany(query) {
        return await this.prisma.jobSeeker.findMany(query);
    }
}
exports.default = PrismaDatabaseClient;
