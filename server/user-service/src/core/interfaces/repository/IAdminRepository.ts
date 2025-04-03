import { IAdmin } from "@shared/types/user.types";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
}
