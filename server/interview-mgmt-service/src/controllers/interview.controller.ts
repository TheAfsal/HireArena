import { Request, Response } from "express";
import { IInterviewService } from "@core/interfaces/services/IInterviewService";
import { createConversation, GetCompaniesDetails, IsJobExist } from "@config/grpcClient";
import IAptitudeService from "@core/interfaces/services/IAptitudeService";
import { IInterviewController } from "@core/interfaces/controllers/IInterviewController";
import { RoundStatus, RoundType } from "model/Interview";

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

      console.log(1);
      
      
      const jobDetails = await IsJobExist(jobId);
      console.log(2);
      
      if (!jobDetails) throw new Error("Job not found");
      console.log(jobDetails);
      console.log(3);
      
      const application = await this.interviewService.applyForJob(
        jobId,
        userId,
        {
          ...jobDetails.job,
          testOptions: JSON.parse(jobDetails.job.testOptions),
        }
      );
      console.log(4);
      
      const companyId = jobDetails.job.companyId;
      
      const companyDetails = await GetCompaniesDetails([companyId]);
      
      console.log(5);
      console.log(companyDetails);
      console.log(6);
      
      await createConversation(
        [userId, companyId],
        jobId,
        companyDetails[0].companyName,
        companyDetails[0].logo
      );

      console.log(6);
      
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
      ) {
        await this.aptitudeService.scheduleAptitude(interviewId);
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
      const { userId,companyId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if(companyId){
        return res
          .status(200)
          .json({ status: false, message: "not a job-seeker" });
      }  

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

  getAllApplications = async (req: Request, res: Response) => {
    try {
      const { userId, companyId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const applications = await this.interviewService.getAllApplications(
        userId,
        companyId
      );

      console.log("@@ companies all application", applications);

      res.status(200).json(applications);
      return;
    } catch (error) {
      console.log("@@ Error fetching job applications by Company:", error);
      res.status(500).json({ success: false, message: "Server error" });
      return;
    }
  };

  getApplicationsCandidate = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const applications = await this.interviewService.getApplicationsCandidate(
        userId
      );

      console.log("@@ companies all application of candidate", applications);

      res.status(200).json(applications);
      return;
    } catch (error) {
      console.log("@@ Error fetching applications for candidate :", error);
      res.status(500).json({ success: false, message: "Server error" });
      return;
    }
  };

  fetchScheduleInterviews = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const applications = await this.interviewService.getScheduleInterviews(
        userId
      );

      console.log("@@ schduled applications of ", applications);

      res.status(200).json(applications);
      return;
    } catch (error) {
      console.log("@@ Error fetching applications for candidate :", error);
      res.status(500).json({ success: false, message: "Server error" });
      return;
    }
  };

  scheduleInterview = async (req: Request, res: Response) => {
    try {
      const { interviewId, scheduledAt } = req.body.form;

      const { userId, role } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      console.log(interviewId, role, scheduledAt);

      if (!interviewId || !role || !scheduledAt) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const scheduledDate = new Date(scheduledAt);
      if (isNaN(scheduledDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      const updatedInterview = await this.interviewService.scheduleInterview(
        interviewId,
        userId,
        role as RoundType,
        scheduledDate
      );

      res.status(200).json({
        success: true,
        data: updatedInterview,
        message: "Interview scheduled successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: `Error scheduling interview: ${(error as Error).message}`,
      });
    }
  };

  submitVideoInterview = async (req: Request, res: Response) => {
    try {
      const { interviewId, candidateId, remarks, status } = req.body;
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null; 
      
      if (!interviewId || !candidateId || !status || !remarks) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (!Object.values(RoundStatus).includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedInterview = await this.interviewService.submitVideoInterview(
        interviewId,
        candidateId,
        userId,
        remarks,
        status as RoundStatus
      );
      console.log(3);
      
      res.status(200).json({
        success: true,
        data: updatedInterview,
        message: "Video interview submitted successfully"
      });
    } catch (error) {
      console.log(4);
      console.log(error);
      
      res.status(500).json({
        success: false,
        message: `Error submitting video interview: ${(error as Error).message}`
      });
    }
  }

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
