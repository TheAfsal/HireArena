import { Request, Response } from "express";
import AptitudeTestService from "@services/aptitudeTest.service";

export class AptitudeTestController {
  private aptitudeTestService: AptitudeTestService;

  constructor(aptitudeTestService: AptitudeTestService) {
    this.aptitudeTestService = aptitudeTestService;
  }

  submitTest = async (req: Request, res: Response) => {
    try {
      const { interviewId, data } = req.body;

      if (!interviewId || !Array.isArray(data)) {
        res
          .status(400)
          .json({ message: "Missing or invalid interviewId or data." });
        return;
      }

      const result = await this.aptitudeTestService.submitTest(
        interviewId,
        data
      );
      res.status(200).json(result);
      return;
    } catch (error: any) {
      console.error("Error submitting aptitude test:", error);
      res.status(500).json({ message: error.message });
      return;
    }
  };

  getAptitudeResult = async (req: Request, res: Response) => {
    try {
      const { interviewId } = req.params;
      const result = await this.aptitudeTestService.getAptitudeResult(
        interviewId
      );
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.log(error);

      res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  };
}
