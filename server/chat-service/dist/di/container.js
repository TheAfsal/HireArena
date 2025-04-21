"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const types_1 = require("./types");
const chat_controller_1 = require("../controllers/chat.controller");
const chat_service_1 = require("../services/chat.service");
const conversation_repository_1 = require("../repositories/conversation.repository");
const message_repository_1 = require("../repositories/message.repository");
const userConversations_repository_1 = require("../repositories/userConversations.repository");
const socket_service_1 = require("../services/socket.service");
const container = new inversify_1.Container();
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });
container.bind(types_1.TYPES.ChatController).to(chat_controller_1.ChatController);
container.bind(types_1.TYPES.ChatService).to(chat_service_1.ChatService);
container.bind(types_1.TYPES.MessageRepository).to(message_repository_1.MessageRepository);
container.bind(types_1.TYPES.ConversationRepository).to(conversation_repository_1.ConversationRepository);
container.bind(types_1.TYPES.UserConversationsRepository).to(userConversations_repository_1.UserConversationsRepository);
container.bind(types_1.TYPES.SocketManager).to(socket_service_1.SocketManager);
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
exports.default = container;
