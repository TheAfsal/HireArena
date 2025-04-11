import express from "express";
import InterviewController from "@controllers/interview.controller";
import InterviewService from "@services/interview.service";
import InterviewRepository from "@repositories/interview.repository";
import AptitudeTestService from "@services/aptitude.service";
import { SubmitAptitudeTest } from "../usecase/submitAptitudeTest";
import AptitudeService from "@services/aptitude.service";
import QuestionRepository from "@repositories/questions.repository";
// import CandidateResponseRepository from "@repositories/candidateResponse.repository";
// import { InterviewRoundRepository } from "@repositories/interviewRound.repository";

const router = express.Router();

const interviewRepo = new InterviewRepository();
const questionRepo = new QuestionRepository();

const interviewServer = new InterviewService(interviewRepo);
const aptitudeServer = new AptitudeService(questionRepo, interviewRepo);

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
router.get("/status/:id", interviewController.getApplicationStatus);
router.get("/:interviewId", interviewController.getInterview);

// router.get("/my-applications", interviewController.getAllApplications);

// router.get("/status/:jobId", interviewController.fetchAppliedJobStatus);

// router.get("/aptitude-result/:interviewId", aptitudeTestController.getAptitudeResult);

export default router;
