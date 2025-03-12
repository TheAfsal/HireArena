import { IAdmin } from "@repositories/AdminRepository";

export interface IAdminRepository {
    findByEmail(email: string): Promise<IAdmin | null>;
  }
  