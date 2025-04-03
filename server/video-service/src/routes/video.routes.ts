import { IChatController } from "@core/interfaces/controllers/IVideoController";
import container from "di/container";
import { TYPES } from "di/types";
import express from "express";

const router = express.Router();

const videoController = container.get<IChatController>(TYPES.VideoController);

router.get("/", videoController.getUserConversations);

router.get("/company", videoController.getUserConversationsCompany);

export default router;
