import TransactionRepository from "../repositories/TransactionRepository";

class TransactionService {
  private transactionRepository: TransactionRepository;
  constructor(transactionRepository: TransactionRepository) {
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
