"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TransactionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTransaction(data) {
        return await this.prisma.transaction.create({ data });
    }
    async updateTransactionStatus(transactionId, status, paymentId) {
        return await this.prisma.transaction.update({
            where: { id: transactionId },
            data: { paymentId, status },
        });
    }
}
exports.default = TransactionRepository;
