export interface ITransactionService {
  createTransaction(data: any): Promise<any>;
  updateTransactionStatus(
    transactionId: string,
    status: "completed" | "failed",
    paymentId: string
  ): Promise<any>;
}
