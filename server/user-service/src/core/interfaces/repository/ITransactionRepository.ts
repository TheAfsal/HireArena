export interface ITransactionRepository {
  createTransaction(data: any): Promise<any>;
  updateTransactionStatus(transactionId: string, status: "completed" | "failed", paymentId: string | null): Promise<any>;
}
