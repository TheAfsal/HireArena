import { Request, Response } from "express";
import { IInterviewService } from "@core/interfaces/services/IInterviewService";
import { IsJobExist } from "@config/grpcClient";
import IAptitudeService from "@core/interfaces/services/IAptitudeService";
import { IInterviewController } from "@core/interfaces/controllers/IInterviewController";

class InterviewController implements IInterviewController {
  constructor(
    private interviewService: IInterviewService,
    private aptitudeService: IAptitudeService
  ) {}

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

  //     if (typeof questions === "string") {
  //       res.status(403).json({ success: false, message: questions });
  //       return;
  //     }

  //     res.json({ success: true, questions });
  //   } catch (error) {
  //     console.log(error);
  //     res
  //       .status(500)
  //       .json({ success: false, message: (error as Error).message });
  //   }
  // };

  // fetchAppliedJobStatus = async (req: Request, res: Response) => {
  //   try {
  //     const { jobId } = req.params;

  //     const { userId } = req.headers["x-user"]
  //       ? JSON.parse(req.headers["x-user"] as string)
  //       : null;

  //     if (!jobId) {
  //       res.status(400).json({ error: "Application is missing" });
  //       return;
  //     }

  //     const status = await this.interviewService.fetchAppliedJobStatus(
  //       jobId,
  //       userId
  //     );
  //     res.json({ status });
  //     return;
  //   } catch (error: any) {
  //     res.status(500).json({ error: error.message });
  //     return;
  //   }
  // };

  // Adding changes

  applyJob = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.body;
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if (!jobId) {
        res.status(400).json({ message: "job is required" });
        return;
      }

      const jobDetails = await IsJobExist(jobId);

      if (!jobDetails) throw new Error("Job not found");

      const application = await this.interviewService.applyForJob(
        jobId,
        userId,
        {
          ...jobDetails.job,
          testOptions: JSON.parse(jobDetails.job.testOptions),
        }
      );

      // const companyId = jobDetails.companyId;

      // const companyDetails = await getCompaniesDetails([companyId]);

      // await createConversation(
      //   [userId, companyId],
      //   jobId,
      //   companyDetails[0].companyName,
      //   companyDetails[0].logo
      // );

      if (!application.state) {
        throw new Error("Job application failed");
      }

      if (application.state[0].roundType === "Aptitude Test") {
        res.status(201).json({
          message: "Job application submitted, aptitude test scheduled",
          interviewId: application._id,
        });
        return;
      }

      res.status(201).json(application);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: (error as Error).message });
    }
  };

  getInterview = async (req: Request, res: Response) => {
    try {
      const { interviewId } = req.params;

      if (!interviewId) {
        res
          .status(400)
          .json({ success: false, message: "Interview ID is required" });
        return;
      }

      const application = await this.interviewService.findApplicationById(
        interviewId
      );

      if (!application || !application.jobId) {
        return res.status(400).json({
          success: false,
          message: "The requested application is not valid",
        });
      }

      const questions = await this.aptitudeService.fetchQuestions(
        application.jobId
      );

      if (!questions) {
        return res.status(400).json({
          success: false,
          message: "Questions generation failed",
        });
      }

      if (
        application.state[application.state.length - 1].roundType ===
        "Aptitude Test"
      ){
        await this.aptitudeService.scheduleAptitude(
          interviewId
        );
        res.json({ success: true, questions: questions.aptitudeQuestions });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  };

  getApplicationStatus = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const jobId = req.params.id;

      const applications = await this.interviewService.getApplicationsStatus(
        userId,
        jobId
      );

      if (!applications)
        return res
          .status(200)
          .json({ status: false, message: "user not applied for thie job" });

      console.log("@@ fetching candidate application status: ", applications);

      res.status(200).json({ state: applications.state });
      return;
    } catch (error) {
      console.log("Error fetching job applications:", error);
      res.status(500).json({ success: false, message: "Server error" });
      return;
    }
  };

  // getAllApplications = async (req: Request, res: Response) => {
  //   try {
  //     const { userId } = req.headers["x-user"]
  //       ? JSON.parse(req.headers["x-user"] as string)
  //       : null;

  //     const applications = await this.jobService.getAllApplications(userId);

  //     res.status(200).json({ success: true, data: applications });
  //     return;
  //   } catch (error) {
  //     console.log("Error fetching job applications:", error);
  //     res.status(500).json({ success: false, message: "Server error" });
  //     return;
  //   }
  // };

  //to delete upto -------

  // getCompanyIdByUserId = (
  //   call: grpc.ServerUnaryCall<any, any>,
  //   callback: grpc.sendUnaryData<any>
  // ) => {
  //   const { userId } = call.request;

  //   this.companyService.getCompanyIdByUserId(userId, callback);
  // };

  // async getCompanyDetailsById(
  //   companyIds: string[],
  //   callback: grpc.sendUnaryData<{ companies: any[] }>
  // ): Promise<void> {
  //   this.companyRepository
  //     .findByIds(companyIds)
  //     .then((details: ICompany[]) => {
  //       if (details.length) {
  //         console.log(details);
  //         callback(null, { companies: details });
  //       } else {
  //         callback({
  //           code: grpc.status.NOT_FOUND,
  //           details: "Companies not found",
  //         });
  //       }
  //     })
  //     .catch((err: Error) => {
  //       callback({
  //         code: grpc.status.INTERNAL,
  //         details: err.message,
  //       });
  //     });
  // }

  // ---------------------------------------

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
