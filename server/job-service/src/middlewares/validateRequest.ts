import { Request, Response, NextFunction } from "express";
import { jobValidationSchema } from "../validations/jobValidations";

export const validateJob = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = jobValidationSchema.safeParse(req.body);

  //@ts-ignore
  
  
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
