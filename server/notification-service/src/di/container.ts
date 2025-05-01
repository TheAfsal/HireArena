import { Container } from "inversify";

import { TYPES } from "./types";

// import { SocketManager } from "@services/socket.service";
import { VideoCallService } from "@services/notification.service";
import { VideoCallRepository } from "@repositories/notification.repository";

const container = new Container();

container
  .bind<VideoCallService>(TYPES.VideoCallService)
  .to(VideoCallService)
  .inSingletonScope();
container
  .bind<VideoCallRepository>(TYPES.VideoCallRepository)
  .to(VideoCallRepository)
  .inSingletonScope();

// container.bind<SocketManager>(TYPES.SocketManager).to(SocketManager);

export default container;
