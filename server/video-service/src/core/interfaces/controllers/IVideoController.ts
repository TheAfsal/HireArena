import { Request, Response } from "express";
import { Socket } from "socket.io";

export interface IChatController {
    // registerEvents(socket: Socket):void;
    getUserConversations(request:Request, response:Response):Promise<void>;
    getUserConversationsCompany(request:Request, response:Response):Promise<void>;
}
