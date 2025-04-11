export interface IBaseRepository<T, ID> {
    save(entity: Partial<T>): Promise<T>;
    findById(id: ID): Promise<T | null>;
    findAll(): Promise<T[]>;
    update(id: ID, data: Partial<T>): Promise<T>;
  }