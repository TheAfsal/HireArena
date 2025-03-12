import {
  ITransaction,
  ITransactionCreateInput,
} from "@core/types/repository/schema.types";

export interface ITransactionRepository {
  createTransaction(data: ITransactionCreateInput): Promise<ITransaction>;
  updateTransactionStatus(
    transactionId: string,
    status: "completed" | "failed",
    paymentId: string | null
  ): Promise<ITransaction>;
}
