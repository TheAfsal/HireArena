import { ITransactionRepository } from "@core/interfaces/repository/ITransactionRepository";
import {
  ITransaction,
  ITransactionCreateInput,
} from "@core/types/repository/schema.types";
import { PrismaClient } from "@prisma/client";

class TransactionRepository implements ITransactionRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createTransaction(
    data: ITransactionCreateInput
  ): Promise<ITransaction> {
    return await this.prisma.transaction.create({ data });
  }

  async updateTransactionStatus(
    transactionId: string,
    status: "completed" | "failed",
    paymentId: string | null
  ): Promise<ITransaction> {
    return await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { paymentId, status },
    });
  }
}

export default TransactionRepository;
