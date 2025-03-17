import { Socket } from "socket.io";

export interface IChatController {
  setupSocketEvents(socket: Socket);
}
