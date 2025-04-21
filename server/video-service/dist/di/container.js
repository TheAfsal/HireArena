"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const types_1 = require("./types");
// import { SocketManager } from "../services/socket.service";
const videoCall_service_1 = require("../services/videoCall.service");
const videoCall_repository_ts_1 = require("@repositories/videoCall.repository.ts");
const container = new inversify_1.Container();
container
    .bind(types_1.TYPES.VideoCallService)
    .to(videoCall_service_1.VideoCallService)
    .inSingletonScope();
container
    .bind(types_1.TYPES.VideoCallRepository)
    .to(videoCall_repository_ts_1.VideoCallRepository)
    .inSingletonScope();
// container.bind<SocketManager>(TYPES.SocketManager).to(SocketManager);
exports.default = container;
