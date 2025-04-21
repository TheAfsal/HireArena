"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.ChatController = void 0;
const types_1 = require("../di/types");
const inversify_1 = require("inversify");
const grpc_client_1 = require("../config/grpc.client");
let ChatController = class ChatController {
    constructor(VideoService) {
        this.VideoService = VideoService;
        this.getUserConversations = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                if (!userId) {
                    res.status(400).json({ message: "userId is required" });
                    return;
                }
                // const conversations = await this.chatService.getUserConversations(userId);
                // res.status(200).json({ conversations, userId });
                return;
            }
            catch (error) {
                res.status(500).json({ message: error.message });
                return;
            }
        });
        this.getUserConversationsCompany = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                if (!userId) {
                    res.status(400).json({ message: "userId is required" });
                    return;
                }
                const companyId = yield (0, grpc_client_1.getCompanyIdByUserId)(userId);
                if (!companyId) {
                    res.status(400).json({ error: "Company ID is required" });
                    return;
                }
                // const conversations = await this.chatService.getUserConversations(
                //   companyId
                // );
                // res.status(200).json({ conversations, companyId });
                return;
            }
            catch (error) {
                res.status(500).json({ message: error.message });
                return;
            }
        });
    }
};
exports.ChatController = ChatController;
exports.ChatController = ChatController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.VideoService)),
    __metadata("design:paramtypes", [Object])
], ChatController);
