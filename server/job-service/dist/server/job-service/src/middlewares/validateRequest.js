"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJob = void 0;
const jobValidations_1 = require("../validations/jobValidations");
const validateJob = (req, res, next) => {
    const result = jobValidations_1.jobValidationSchema.safeParse(req.body);
    if (!result.success) {
        console.log(result.error.format());
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: result.error.format(),
        });
        return;
    }
    next();
};
exports.validateJob = validateJob;
