"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/SkillRoutes.ts
const express_1 = require("express");
const SkillRepository_1 = __importDefault(require("../repositories/SkillRepository"));
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const SkillService_1 = require("../services/SkillService");
const skillController_1 = require("../controllers/skillController");
const router = (0, express_1.Router)();
const skillRepository = new SkillRepository_1.default(prismaClient_1.default);
const skillService = new SkillService_1.SkillService(skillRepository);
const skillController = new skillController_1.SkillController(skillService);
router.post("/create", skillController.create);
router.put("/update", skillController.update);
router.get("/:id", skillController.get);
router.get("/", skillController.getAll);
router.delete("/:id", skillController.delete);
exports.default = router;
