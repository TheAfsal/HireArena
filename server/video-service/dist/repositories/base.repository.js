"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = new this.model(data);
            return yield entity.save();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findById(id).exec();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find().exec();
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(id, data, { new: true }).exec();
        });
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find(query).exec();
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne(query).exec();
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findByIdAndDelete(id).exec();
            return !!result;
        });
    }
}
exports.BaseRepository = BaseRepository;
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
