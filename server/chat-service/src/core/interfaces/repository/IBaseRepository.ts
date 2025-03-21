import { Model, Document } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  find(query: any): Promise<T[]>;
  findOne(query: any): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
