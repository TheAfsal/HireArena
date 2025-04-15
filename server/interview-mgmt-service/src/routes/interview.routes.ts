import express from "express";
import InterviewController from "@controllers/interview.controller";
import InterviewService from "@services/interview.service";
import InterviewRepository from "@repositories/interview.repository";
import AptitudeService from "@services/aptitude.service";
import QuestionRepository from "@repositories/questions.repository";
import AptitudeTestResultRepository from "@repositories/aptitudeTestResult.repository";
import EmployeeInterviewsRepository from "@repositories/EmployeeInterviewsRepository";
// import CandidateResponseRepository from "@repositories/candidateResponse.repository";
// import { InterviewRoundRepository } from "@repositories/interviewRound.repository";

const router = express.Router();

const interviewRepo = new InterviewRepository();
const questionRepo = new QuestionRepository();
const aptitudeResultRepo = new AptitudeTestResultRepository();
const employeeInterviewsRepo = new EmployeeInterviewsRepository();

const interviewServer = new InterviewService(interviewRepo, employeeInterviewsRepo);
const aptitudeServer = new AptitudeService(questionRepo, interviewRepo,aptitudeResultRepo);

const interviewController = new InterviewController(
  interviewServer,
  aptitudeServer
);

// const responseRepo = new CandidateResponseRepository();
// const interviewRoundRepo = new InterviewRoundRepository();
// const submitAptitudeTest = new SubmitAptitudeTest(interviewRepo, responseRepo,interviewRoundRepo);

// const aptitudeTestService = new AptitudeTestService(submitAptitudeTest,responseRepo,interviewRepo,interviewRoundRepo);
// const aptitudeTestController = new AptitudeTestController(aptitudeTestService);

router.post("/apply", interviewController.applyJob);
router.post("/schedule", interviewController.scheduleInterview);
router.get("/status/:id", interviewController.getApplicationStatus);
router.get("/company-applications", interviewController.getAllApplications);
router.get("/:interviewId", interviewController.getInterview);


// router.get("/status/:jobId", interviewController.fetchAppliedJobStatus);

// router.get("/aptitude-result/:interviewId", aptitudeTestController.getAptitudeResult);

export default router;
