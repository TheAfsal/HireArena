"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/CategoryRoutes.ts
const express_1 = require("express");
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const CategoryService_1 = require("../services/CategoryService");
const CategoryRepository_1 = __importDefault(require("../repositories/CategoryRepository"));
const categoryController_1 = require("../controllers/categoryController");
const router = (0, express_1.Router)();
const categoryRepository = new CategoryRepository_1.default(prismaClient_1.default);
const categoryService = new CategoryService_1.CategoryService(categoryRepository);
const categoryController = new categoryController_1.CategoryController(categoryService);
router.post("/create", categoryController.create);
router.put("/update", categoryController.update);
router.get("/:id", categoryController.get);
router.get("/", categoryController.getAll);
router.delete("/:id", categoryController.delete);
exports.default = router;
