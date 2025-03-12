import { ITransactionRepository } from "@core/interfaces/repository/ITransactionRepository";
import { PrismaClient } from "@prisma/client/default";

class TransactionRepository implements ITransactionRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createTransaction(data: any) {
    return await this.prisma.transaction.create({ data });
  }

  async updateTransactionStatus(
    transactionId: string,
    status: "completed" | "failed",
    paymentId: string | null
  ) {
    
    return await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { paymentId, status },
    });
  }
}

export default TransactionRepository;
