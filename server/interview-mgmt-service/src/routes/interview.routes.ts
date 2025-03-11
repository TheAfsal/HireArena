import express from "express";
import InterviewController from "../controllers/interview.controller";
import { InterviewService } from "../services/interview.service";
import InterviewRepository from "../repositories/interview.repository";
import prisma from "../config/prismaClient";
import { AptitudeTestController } from "../controllers/aptitudeTest.controller";
import AptitudeTestService from "../services/aptitudeTest.service";
import { SubmitAptitudeTest } from "../usecase/submitAptitudeTest";
import CandidateResponseRepository from "../repositories/candidateResponse.repository";
import { InterviewRoundRepository } from "../repositories/interviewRound.repository";

const router = express.Router();

const interviewRepo = new InterviewRepository(prisma);

const interviewServer = new InterviewService(interviewRepo);

const interviewController = new InterviewController(interviewServer);

const responseRepo = new CandidateResponseRepository(prisma);
const interviewRoundRepo = new InterviewRoundRepository(prisma);
const submitAptitudeTest = new SubmitAptitudeTest(interviewRepo, responseRepo,interviewRoundRepo);

const aptitudeTestService = new AptitudeTestService(submitAptitudeTest,responseRepo,interviewRepo,interviewRoundRepo);
const aptitudeTestController = new AptitudeTestController(aptitudeTestService);

// router.post("/apply", interviewController.applyForJob);

router.get("/status/:jobId", interviewController.fetchAppliedJobStatus);
router.get("/questions/:interviewId", interviewController.getAptitudeQuestions);
router.post("/submit-aptitude", aptitudeTestController.submitTest);
router.get("/aptitude-result/:interviewId", aptitudeTestController.getAptitudeResult);

export default router;
