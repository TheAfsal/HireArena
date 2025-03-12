import { Router } from "express";
import SubscriptionController from "@controllers/subscription.controller";

const router = Router();

const subscriptionController = new SubscriptionController();

router.post("/", subscriptionController.create);
// router.put("/:id", subscriptionController.update);
router.delete("/:id", subscriptionController.delete);
// router.get("/:id", subscriptionController.getById);
router.get("/", subscriptionController.getAll);

export default router;
