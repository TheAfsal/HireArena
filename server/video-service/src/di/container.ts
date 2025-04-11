import { Container } from "inversify";

import { TYPES } from "./types";

// import { SocketManager } from "@services/socket.service";
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

// container.bind<SocketManager>(TYPES.SocketManager).to(SocketManager);

export default container;
