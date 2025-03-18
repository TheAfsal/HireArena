import { IBaseRepository } from '@core/interfaces/repository/IBaseRepository';
import { Model, Document } from 'mongoose';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const entity = new this.model(data);
    return await entity.save();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findAll(): Promise<T[]> {
    return await this.model.find().exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}


// import { Model, Document } from "mongoose";

// export abstract class BaseRepository<T extends Document> {
//   protected model: Model<T>;

//   constructor(model: Model<T>) {
//     this.model = model;
//   }

//   async create(data: Partial<T>): Promise<T> {
//     const entity = new this.model(data);
//     return await entity.save();
//   }

//   async findById(id: string): Promise<T | null> {
//     return await this.model.findById(id).exec();
//   }

//   async find(query: any): Promise<T[]> {
//     return await this.model.find(query).exec();
//   }

//   async update(id: string, data: Partial<T>): Promise<T | null> {
//     return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
//   }

//   async delete(id: string): Promise<void> {
//     await this.model.findByIdAndDelete(id).exec();
//   }
// }