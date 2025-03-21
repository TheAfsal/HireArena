import { Server } from "socket.io";
import { Container } from "inversify";

import { TYPES } from "./types";

import { ChatController } from "@controllers/chat.controller";

import { ChatService } from "@services/chat.service";

import { ConversationRepository } from "@repositories/conversation.repository";
import { MessageRepository } from "@repositories/message.repository";
import { UserConversationsRepository } from "@repositories/userConversations.repository";

import { IChatController } from "@core/interfaces/controllers/IChatController";
import { IChatService } from "@core/interfaces/services/IChatService";
import { IMessageRepository } from "@core/interfaces/repository/IMessageRepository";
import { IConversationRepository } from "@core/interfaces/repository/IConversationRepository";
import { IUserConversationsRepository } from "@core/interfaces/repository/IUserConversationRepository";



const container = new Container();
const io = new Server(); 

container.bind<IChatController>(TYPES.ChatController).to(ChatController);
container.bind<IChatService>(TYPES.ChatService).to(ChatService);
container.bind<IMessageRepository>(TYPES.MessageRepository).to(MessageRepository);
container.bind<IConversationRepository>(TYPES.ConversationRepository).to(ConversationRepository);
container.bind<IUserConversationsRepository>(TYPES.UserConversationsRepository).to(UserConversationsRepository);

container.bind<Server>(TYPES.SocketIOServer).toConstantValue(io);

export default container;