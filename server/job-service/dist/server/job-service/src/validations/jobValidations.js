"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobValidationSchema = void 0;
const zod_1 = require("zod");
exports.jobValidationSchema = zod_1.z.object({
    jobTitle: zod_1.z.string().min(3, "Job title must be at least 3 characters long"),
    employmentTypes: zod_1.z
        .array(zod_1.z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE", "INTERNSHIP"]))
        .nonempty("At least one employment type is required"),
    salaryRange: zod_1.z.object({
        min: zod_1.z.number().min(0, "Minimum salary must be at least 0"),
        max: zod_1.z.number().min(1, "Maximum salary must be greater than 0"),
    }),
    jobDescription: zod_1.z.string().min(10, "Job description must be at least 10 characters"),
    responsibilities: zod_1.z.string().min(5, "Responsibilities must be at least 5 characters"),
    qualifications: zod_1.z.string().min(5, "Qualifications must be at least 5 characters"),
    niceToHave: zod_1.z.string().optional(),
    benefits: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string().min(3, "Benefit title must be at least 3 characters"),
        description: zod_1.z.string().min(5, "Benefit description must be at least 5 characters"),
        icon: zod_1.z.string(),
    })).optional(),
});
