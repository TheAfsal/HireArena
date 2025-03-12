import { ITransactionService } from "@core/interfaces/services/ITransactionService";
import { ITransactionRepository } from "@core/interfaces/repository/ITransactionRepository";

class TransactionService implements ITransactionService {
  private transactionRepository: ITransactionRepository;
  constructor(transactionRepository: ITransactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async createTransaction(data: any) {
    return await this.transactionRepository.createTransaction(data);
  }

  async updateTransactionStatus(
    transactionId: string,
    status: "completed" | "failed",
    paymentId: string
  ) {
    return await this.transactionRepository.updateTransactionStatus(
      transactionId,
      status,
      paymentId
    );
  }
}

export default TransactionService;
