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
exports.UserConversationsRepository = void 0;
const base_repository_1 = require("./base.repository");
const userConversations_model_1 = require("../model/userConversations.model");
class UserConversationsRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(userConversations_model_1.UserConversations);
    }
    upsertUserConversation(userId, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userConversations_model_1.UserConversations.findOneAndUpdate({ userId }, { $addToSet: { conversationIds: conversationId }, updatedAt: new Date() }, { upsert: true, new: true }).exec();
        });
    }
    getUserConversations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ userId });
        });
    }
}
exports.UserConversationsRepository = UserConversationsRepository;
