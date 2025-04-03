import { Server } from "socket.io";
import { Container } from "inversify";

import { TYPES } from "./types";

import { ChatController } from "@controllers/video.controller";

import { IChatController } from "@core/interfaces/controllers/IVideoController";
import { IChatService } from "@core/interfaces/services/IChatService";
import { IMessageRepository } from "@core/interfaces/repository/IMessageRepository";
import { IConversationRepository } from "@core/interfaces/repository/IConversationRepository";
import { IUserConversationsRepository } from "@core/interfaces/repository/IUserConversationRepository";
import server from "app";
import { SocketManager } from "@services/socket.service";
import { VideoCallService } from "@services/videoCall.service";
import { VideoCallRepository } from "@repositories/videoCall.repository.ts";

const container = new Container();

container
  .bind<VideoCallService>(TYPES.VideoCallService)
  .to(VideoCallService)
  .inSingletonScope();
container
  .bind<VideoCallRepository>(TYPES.VideoCallRepository)
  .to(VideoCallRepository)
  .inSingletonScope();

container.bind<SocketManager>(TYPES.SocketManager).to(SocketManager);

export default container;
