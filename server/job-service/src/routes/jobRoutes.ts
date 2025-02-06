import express, { Request, Response } from "express";
import JobService from "../services/JobService";

const router = express.Router();
const jobService = new JobService();

// 🔹 Create Job API Endpoint
router.post("/", async (req: Request, res: Response) => {
  try {
    const job = await jobService.createJob(req.body);
    res.status(201).json({ message: "Job created successfully", job });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
