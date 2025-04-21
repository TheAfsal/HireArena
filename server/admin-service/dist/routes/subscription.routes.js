"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../di/container"));
const types_1 = require("../di/types");
const router = (0, express_1.Router)();
const subscriptionController = container_1.default.get(types_1.TYPES.SubscriptionController);
router.post("/", subscriptionController.create);
// router.put("/:id", subscriptionController.update);
router.delete("/:id", subscriptionController.delete);
// router.get("/:id", subscriptionController.getById);
router.get("/", subscriptionController.getAll);
exports.default = router;
