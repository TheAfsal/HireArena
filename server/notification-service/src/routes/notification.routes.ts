import NotificationController from "@controllers/notification.controller";
import { NotificationRepository } from "@repositories/notification.repository";
import { NotificationService } from "@services/notification.service";
import express from "express";

const router = express.Router();

const notificationRepo = new NotificationRepository()
const notificationService = new NotificationService(notificationRepo)
const notificationController = new NotificationController(notificationService)

router.get("/", notificationController.getCandidateNotifications);
router.patch("/read/:notificationId", notificationController.markNotificationAsRead);

export default router;
