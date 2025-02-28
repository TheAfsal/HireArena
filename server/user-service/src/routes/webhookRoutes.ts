import express from "express";
import WebhookController from "../controllers/webhookController";
// import bodyParser from "body-parser";

const router = express.Router();

// Stripe requires raw body for webhook verification
router.post(
  "/stripe",
  // bodyParser.raw({ type: "application/json" }),
  // WebhookController.handleWebhook
);

export default router;
