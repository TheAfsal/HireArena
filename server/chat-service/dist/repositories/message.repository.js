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
exports.MessageRepository = void 0;
const base_repository_1 = require("./base.repository");
const message_model_1 = require("../model/message.model");
class MessageRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(message_model_1.Message);
    }
    saveMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(message);
        });
    }
    getMessagesByConversationId(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield message_model_1.Message.find({ conversationId }).sort({ timestamp: 1 }).exec();
        });
    }
}
exports.MessageRepository = MessageRepository;
