export interface IBaseRepository<T, CreateInput, UpdateInput> {
  create(data: CreateInput): Promise<T>;
  update(id: string, data: UpdateInput): Promise<T>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
}
