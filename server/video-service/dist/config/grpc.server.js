"use strict";
// import { IChatService } from "../core/interfaces/services/IChatService";
// import * as grpc from "@grpc/grpc-js";
// import * as protoLoader from "@grpc/proto-loader";
// import { Request, Response } from "@workspace/proto/chatProto/chat.types";
// import container from "../di/container";
// import { TYPES } from "../di/types";
Object.defineProperty(exports, "__esModule", { value: true });
// const PROTO_PATH = require.resolve("@workspace/proto/chatProto/chat.proto");
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// });
// const proto = grpc.loadPackageDefinition(packageDefinition) as any;
// const chatService = container.get<IChatService>(TYPES.ChatService);
// const chatController: {
//   CreateConversation: (
//     call: grpc.ServerUnaryCall<Request, Response>,
//     callback: grpc.sendUnaryData<Response>
//   ) => void;
// } = {
//   CreateConversation: (
//     call: grpc.ServerUnaryCall<Request, Response>,
//     callback: grpc.sendUnaryData<Response>
//   ) => {
//     const { participants, jobId, companyName, logo } = call.request;
//     console.log(call.request);    
//     chatService
//     .startConversation(participants, jobId, companyName, logo)
//     .then((conversation) => {
//       callback(null, {
//         conversationId: conversation.id,
//         message: "Conversation created successfully",
//       });
//     })
//     .catch((error) => {
//       callback({
//         code: grpc.status.INTERNAL,
//         message: error.message,
//       });
//     });
//   },
// };
// const server = new grpc.Server();
// server.addService(proto.chat.ChatService.service, chatController);
// export default server;
