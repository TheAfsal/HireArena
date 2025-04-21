import { Server } from "socket.io";
import { Container } from "inversify";

import { TYPES } from "@di/types";

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
import server from "app";
import { SocketManager } from "@services/socket.service";



const container = new Container();
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

container.bind<IChatController>(TYPES.ChatController).to(ChatController);
container.bind<IChatService>(TYPES.ChatService).to(ChatService);
container.bind<IMessageRepository>(TYPES.MessageRepository).to(MessageRepository);
container.bind<IConversationRepository>(TYPES.ConversationRepository).to(ConversationRepository);
container.bind<IUserConversationsRepository>(TYPES.UserConversationsRepository).to(UserConversationsRepository);

container.bind<SocketManager>(TYPES.SocketManager).to(SocketManager);

// container.bind<Server>(TYPES.SocketIOServer).toConstantValue(io);


// export function initializeContainer(io: Server) {
//   container.bind<Server>(TYPES.SocketIOServer).toConstantValue(io);
//   container.bind<IChatController>(TYPES.ChatController).to(ChatController);
//   container.bind<IChatService>(TYPES.ChatService).to(ChatService);
//   container.bind<IMessageRepository>(TYPES.MessageRepository).to(MessageRepository);
//   container.bind<IConversationRepository>(TYPES.ConversationRepository).to(ConversationRepository);
//   container.bind<IUserConversationsRepository>(TYPES.UserConversationsRepository).to(UserConversationsRepository);

//   return container;
// }

export default container;
