import express from "express";
import InterviewController from "@controllers/interview.controller";
import InterviewService from "@services/interview.service";
import InterviewRepository from "@repositories/interview.repository";
import AptitudeService from "@services/aptitude.service";
import QuestionRepository from "@repositories/questions.repository";
import AptitudeTestResultRepository from "@repositories/aptitudeTestResult.repository";
import EmployeeInterviewsRepository from "@repositories/EmployeeInterviewsRepository";

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

router.get("/", interviewController.getApplicationsCandidate);
router.post("/apply", interviewController.applyJob);
router.get("/schedule", interviewController.fetchScheduleInterviews);
router.post("/schedule", interviewController.scheduleInterview);
router.get("/status/:id", interviewController.getApplicationStatus);
router.get("/company-applications", interviewController.getAllApplications);
router.get("/job-applications", interviewController.getJobApplications);
router.post("/submit-video-call-interview", interviewController.submitVideoInterview);
router.get("/:interviewId", interviewController.getInterview);


export default router;
