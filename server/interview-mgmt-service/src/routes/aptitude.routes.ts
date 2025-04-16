import express from "express";
import QuestionRepository from "@repositories/questions.repository";
import AptitudeService from "@services/aptitude.service";
import AptitudeController from "@controllers/aptitude.controller";
import InterviewRepository from "@repositories/interview.repository";
import AptitudeTestResultRepository from "@repositories/aptitudeTestResult.repository";

const router = express.Router();

const interviewRepo = new InterviewRepository();
const questionRepo = new QuestionRepository();
const aptitudeResultRepo = new AptitudeTestResultRepository();

const aptitudeServer = new AptitudeService(questionRepo,interviewRepo,aptitudeResultRepo);
const aptitudeController = new AptitudeController(aptitudeServer);

router.post("/submit", aptitudeController.submitTest);
// router.get("/aptitude-result/:interviewId", aptitudeTestController.getAptitudeResult);



export default router;
