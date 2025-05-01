// src/repositories/base.repository.ts
import mongoose, { Document, Model } from "mongoose";

interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  find(query: any, page?: number, pageSize?: number): Promise<{ data: T[]; total: number }>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const document = await this.model.create(data);
    return document;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async find(query: any, page?: number, pageSize?: number): Promise<{ data: T[]; total: number }> {
    const skip = page && pageSize ? (page - 1) * pageSize : 0;
    const limit = pageSize || 0;

    const [data, total] = await Promise.all([
      this.model
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.model.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}