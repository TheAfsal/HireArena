"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/JobCategoryRoutes.ts
const express_1 = require("express");
const JobCategoryRepository_1 = __importDefault(require("../repositories/JobCategoryRepository"));
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const JobCategoryService_1 = require("../services/JobCategoryService");
const jobCategoryController_1 = require("../controllers/jobCategoryController");
const router = (0, express_1.Router)();
const jobCategoryRepository = new JobCategoryRepository_1.default(prismaClient_1.default);
const jobCategoryService = new JobCategoryService_1.JobCategoryService(jobCategoryRepository);
const jobCategoryController = new jobCategoryController_1.JobCategoryController(jobCategoryService);
router.post("/create", jobCategoryController.create);
router.put("/update", jobCategoryController.update);
router.get("/:id", jobCategoryController.get);
router.get("/", jobCategoryController.getAll);
router.delete("/:id", jobCategoryController.delete);
exports.default = router;
