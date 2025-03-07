import { z } from "zod";

export const jobValidationSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters long"),
  
  employmentTypes: z
    .array(z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE", "INTERNSHIP"]))
    .nonempty("At least one employment type is required"),
  
  salaryRange: z.object({
    min: z.number().min(0, "Minimum salary must be at least 0"),
    max: z.number().min(1, "Maximum salary must be greater than 0"),
  }),

  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
  responsibilities: z.string().min(5, "Responsibilities must be at least 5 characters"),
  qualifications: z.string().min(5, "Qualifications must be at least 5 characters"),
  
  niceToHave: z.string().optional(),
  
  benefits: z.array(
    z.object({
      title: z.string().min(3, "Benefit title must be at least 3 characters"),
      description: z.string().min(5, "Benefit description must be at least 5 characters"),
      icon: z.string(),
    })
  ).optional(),
});
