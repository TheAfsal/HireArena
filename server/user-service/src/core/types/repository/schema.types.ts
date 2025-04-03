import { Prisma } from "@prisma/client";
import { ICompany } from "@shared/types/user.types";

export interface IInvitation {
  id: string;
  email: string;
  companyId: string;
  role: string;
  token: string;
  message: string;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  company?: ICompany;
}

export interface IUserSubscription {
  id: string;
  userId: string;
  planId: string;
  transactionId: string | null;
  startDate: Date;
  expiryDate: Date;
  features: Prisma.JsonValue;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpecialisedUserSubscription
  extends Omit<IUserSubscription, "features"> {
  features: string;
}

export interface ISubscriptionPlanGRPC {
  duration: number;
  features: string;
}

export interface ITransaction {
  id: string;
  userId: string;
  amount: number;
  status: string;
  paymentMethod: string | null;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionCreateInput {
  userId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  paymentId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
