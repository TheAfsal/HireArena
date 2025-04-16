import * as grpc from "@grpc/grpc-js";
import { Request, Response } from "express";
import IAptitudeController from "@core/interfaces/controllers/IAptitudeController";
import IAptitudeService from "@core/interfaces/services/IAptitudeService";

export default class AptitudeController implements IAptitudeController {
  constructor(private aptitudeService: IAptitudeService) {}

  CreateAptitudeTest = async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const { jobId } = call.request;

      if (!jobId) throw new Error("Missing job id");

      console.log(`Generating aptitude test for job ${jobId}...`);

      await this.aptitudeService.createAptitudeTest(jobId);

      return callback(null, { success: true });
    } catch (error) {
      console.error("Error creating aptitude test:", error);
      callback({
        code: grpc.status.INTERNAL,
      });
    }
  };

  submitTest = async (req: Request, res: Response) => {
    try {
      const { interviewId, data } = req.body;

      if (!interviewId || !Array.isArray(data)) {
        res
          .status(400)
          .json({ message: "Missing or invalid interviewId or data." });
        return;
      }

      const result = await this.aptitudeService.submitTest(interviewId, data);
      res.status(200).json(result);
      return;
    } catch (error: any) {
      console.error("Error submitting aptitude test:", error);
      res.status(500).json({ message: error.message });
      return;
    }
  };

  // getAptitudeResult = async (req: Request, res: Response) => {
  //   try {
  //     const { interviewId } = req.params;
  //     const result = await this.aptitudeTestService.getAptitudeResult(
  //       interviewId
  //     );
  //     res.status(200).json({ success: true, result });
  //   } catch (error) {
  //     console.log(error);

  //     res
  //       .status(500)
  //       .json({ success: false, message: (error as Error).message });
  //   }
  // };
}
