import { Request, Response } from "express";
import { InterviewService } from "../services/interview.service";

class InterviewController {
  private interviewService: InterviewService;

  constructor(interviewService: InterviewService) {
    this.interviewService = interviewService;
  }

  getAptitudeQuestions = async (req: Request, res: Response) => {
    try {
      const { interviewId } = req.params;
  
      if (!interviewId) {
        res.status(400).json({ success: false, message: "Interview ID is required" });
        return;
      }
  
      const questions = await this.interviewService.fetchAptitudeQuestions(interviewId);
  
      if (typeof questions === "string") {
        res.status(403).json({ success: false, message: questions }); 
        return;
      }
  
      res.json({ success: true, questions });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  };
  

  // getAptitudeQuestions = async (req: Request, res: Response) => {
  //   try {
  //     const { interviewId } = req.params;

  //     if (!interviewId) {
  //       res
  //         .status(400)
  //         .json({ success: false, message: "Interview ID is required" });
  //       return;
  //     }

  //     const questions = await this.interviewService.fetchAptitudeQuestions(
  //       interviewId
  //     );
  //     res.json(questions);
  //   } catch (error) {
  //     console.log(error);

  //     res
  //       .status(500)
  //       .json({ success: false, message: (error as Error).message });
  //   }
  // };

  fetchAppliedJobStatus = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;

      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if (!jobId) {
        res.status(400).json({ error: "Application is missing" });
        return;
      }

      const status = await this.interviewService.fetchAppliedJobStatus(
        jobId,
        userId
      );
      res.json({ status });
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  // submitAptitudeTest = async(req: Request, res: Response)=> {
  //   try {
  //       const { interviewId, userId, answers } = req.body;
  //       const result = await this.evaluateAptitudeTest.evaluate(interviewId, userId, answers);
  //       res.json(result);
  //   } catch (error) {
  //       res.status(400).json({ error: error.message });
  //   }
  // }

  // applyForJob = async (req: Request, res: Response) => {
  //   try {
  //     const { applicationId, candidateId } = req.body;

  //     if (!applicationId || !candidateId) {
  //       res.status(400).json({ message: "Missing required fields" });
  //       return
  //     }

  //     const interview = await this.interviewService.initiateInterview(
  //       applicationId,
  //       candidateId
  //     );

  //     res.status(201).json({
  //       message: "Aptitude test scheduled. Proceed to the test.",
  //       // interviewId: interview.id,
  //     });
  //     return
  //   } catch (error) {
  //     console.error("Error applying for job:", error);
  //     res.status(500).json({ message: "Internal server error" });
  //     return
  //   }
  // };
}

export default InterviewController;
