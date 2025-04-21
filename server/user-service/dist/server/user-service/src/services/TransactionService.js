"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TransactionService {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    async createTransaction(data) {
        return await this.transactionRepository.createTransaction(data);
    }
    async updateTransactionStatus(transactionId, status, paymentId) {
        return await this.transactionRepository.updateTransactionStatus(transactionId, status, paymentId);
    }
}
exports.default = TransactionService;
