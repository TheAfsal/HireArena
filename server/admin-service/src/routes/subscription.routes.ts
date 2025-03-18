import { Router } from "express";
import container from "di/container";
import { ISubscriptionController } from "@core/interfaces/controllers/ISubscriptionController";
import { TYPES } from "di/types";

const router = Router();

const subscriptionController = container.get<ISubscriptionController>(TYPES.SubscriptionController);

router.post("/", subscriptionController.create);
// router.put("/:id", subscriptionController.update);
router.delete("/:id", subscriptionController.delete);
// router.get("/:id", subscriptionController.getById);
router.get("/", subscriptionController.getAll);

export default router;
