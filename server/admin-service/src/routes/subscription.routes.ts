import { Router } from "express";
import SubscriptionController from "../controllers/subscription.controller";

const router = Router();

router.post("/", SubscriptionController.create);
router.put("/:id", SubscriptionController.update);
router.delete("/:id", SubscriptionController.delete);
router.get("/:id", SubscriptionController.getById);
router.get("/", SubscriptionController.getAll);

export default router;
