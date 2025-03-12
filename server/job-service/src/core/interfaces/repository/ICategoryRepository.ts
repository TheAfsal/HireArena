import { CategoryType } from "@prisma/client";

export interface ICategoryRepository {
  create(data: { name: string; description: string; status: boolean }): Promise<CategoryType>;
  update(id: string, data: { name: string; description: string; status: boolean }): Promise<CategoryType>;
  findById(id: string): Promise<CategoryType | null>;
  findAll(): Promise<CategoryType[]>;
  delete(id: string): Promise<void>;
}
