import { Socket } from "socket.io";

export interface IChatController {
  registerEvents(socket: Socket);
}
