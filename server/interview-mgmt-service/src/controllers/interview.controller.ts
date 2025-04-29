import { Request, Response } from "express";
import { IInterviewService } from "@core/interfaces/services/IInterviewService";
import { createConversation, GetCompaniesDetails, IsJobExist } from "@config/grpcClient";
import IAptitudeService from "@core/interfaces/services/IAptitudeService";
import { IInterviewController } from "@core/interfaces/controllers/IInterviewController";
import { RoundStatus, RoundType } from "model/Interview";
import { StatusCodes } from "http-status-codes";

class InterviewController implements IInterviewController {
  constructor(
    private interviewService: IInterviewService,
    private aptitudeService: IAptitudeService
  ) {}

  applyJob = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.body;
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if (!jobId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "job is required" });
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
      const companyId = jobDetails.job.companyId;
      
      const companyDetails = await GetCompaniesDetails([companyId]);
      
      await createConversation(
        [userId, companyId],
        jobId,
        companyDetails[0].companyName,
        companyDetails[0].logo
      );
      
      if (!application.state) {
        throw new Error("Job application failed");
      }

      if (application.state[0].roundType === "Aptitude Test") {
        res.status(StatusCodes.CREATED).json({
          message: "Job application submitted, aptitude test scheduled",
          interviewId: application._id,
        });
        return;
      }

      res.status(StatusCodes.CREATED).json(application);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: (error as Error).message });
    }
  };

  getInterview = async (req: Request, res: Response) => {
    try {
      const { interviewId } = req.params;

      if (!interviewId) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: "Interview ID is required" });
        return;
      }

      const application = await this.interviewService.findApplicationById(
        interviewId
      );

      if (!application || !application.jobId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "The requested application is not valid",
        });
      }

      const questions = await this.aptitudeService.fetchQuestions(
        application.jobId
      );

      if (!questions) {
        return res.status(StatusCodes.BAD_REQUEST).json({
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
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
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
          .status(StatusCodes.OK)
          .json({ status: false, message: "not a job-seeker" });
      }  

      const jobId = req.params.id;

      const applications = await this.interviewService.getApplicationsStatus(
        userId,
        jobId
      );

      if (!applications)
        return res
          .status(StatusCodes.OK)
          .json({ status: false, message: "user not applied for thie job" });

      console.log("@@ fetching candidate application status: ", applications);

      res.status(StatusCodes.OK).json({ state: applications.state });
      return;
    } catch (error) {
      console.log("Error fetching job applications:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
      return;
    }
  };

  getAllApplications = async(req: Request, res: Response) => {
    try {
      
      const { userId, companyId } = req.headers["x-user"]
      ? JSON.parse(req.headers["x-user"] as string)
      : { userId: null, companyId: null };
      
      if (!userId || !companyId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const { page, pageSize, roundType } = req.query;

      const result = await this.interviewService.getAllApplications(userId, companyId, {
        page,  
        pageSize,
        roundType,
      });

      console.log("result", result);
      

      res.status(StatusCodes.OK).json({
        success: true,
        data: result.applications,
        pagination: {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: Math.ceil(result.total / result.pageSize),
        },
      });
    } catch (error) {
      console.log("@@ Error fetching job applications by Company:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
    }
  }

  getAllApplicationsDashboard = async (req: Request, res: Response) => {
    try {
      const { userId, companyId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const applications = await this.interviewService.getAllApplicationsDashboard(
        userId,
        companyId
      );

      console.log("@@ companies all application", applications);

      res.status(StatusCodes.OK).json(applications);
      return;
    } catch (error) {
      console.log("@@ Error fetching job applications by Company:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
      return;
    }
  };

  getJobApplications = async (req: Request, res: Response) => {
    try {

      const { id } = req.query
      
      const applications = await this.interviewService.getJobApplications( id );

      console.log("@@ companies all application", applications);

      res.status(StatusCodes.OK).json(applications);
      return;
    } catch (error) {
      console.log("@@ Error fetching job applications by Company:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
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

      res.status(StatusCodes.OK).json(applications);
      return;
    } catch (error) {
      console.log("@@ Error fetching applications for candidate :", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
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

      res.status(StatusCodes.OK).json(applications);
      return;
    } catch (error) {
      console.log("@@ Error fetching applications for candidate :", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
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
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing required fields" });
      }

      const scheduledDate = new Date(scheduledAt);
      if (isNaN(scheduledDate.getTime())) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid date format" });
      }

      const updatedInterview = await this.interviewService.scheduleInterview(
        interviewId,
        userId,
        role as RoundType,
        scheduledDate
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: updatedInterview,
        message: "Interview scheduled successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing required fields" });
      }

      if (!Object.values(RoundStatus).includes(status)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid status" });
      }
      
      const updatedInterview = await this.interviewService.submitVideoInterview(
        interviewId,
        candidateId,
        userId,
        remarks,
        status as RoundStatus
      );
      console.log(3);
      
      res.status(StatusCodes.OK).json({
        success: true,
        data: updatedInterview,
        message: "Video interview submitted successfully"
      });
    } catch (error) {
      console.log(4);
      console.log(error);
      
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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
