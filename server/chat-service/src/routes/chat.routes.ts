import { IChatController } from "@core/interfaces/controllers/IChatController";
import container from "di/container";
import { TYPES } from "@di/types";
import express from "express";

const router = express.Router();

const chatController = container.get<IChatController>(TYPES.ChatController);

router.get("/", chatController.getUserConversations);

router.get("/company", chatController.getUserConversationsCompany);

export default router;


