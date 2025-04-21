import { IChatService } from "@core/interfaces/services/IChatService";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import container from "di/container";
import { TYPES } from "di/types";

const PROTO_PATH = require.resolve("../proto/chat.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

const chatService = container.get<IChatService>(TYPES.ChatService);

const chatController: {
  CreateConversation: (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => void;
} = {
  CreateConversation: (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    const { participants, jobId, companyName, logo } = call.request;

    console.log(call.request);    

    chatService
    .startConversation(participants, jobId, companyName, logo)
    .then((conversation) => {
      console.log("@@ &&&&&&&&&&&&&", companyName, logo)
      callback(null, {
        conversationId: conversation.id,
        message: "Conversation created successfully",
      });
    })
    .catch((error) => {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    });
  },
};

const server = new grpc.Server();

server.addService(proto.chat.ChatService.service, chatController);

export default server;
