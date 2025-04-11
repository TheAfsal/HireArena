import express from "express";
import QuestionRepository from "@repositories/questions.repository";
import AptitudeService from "@services/aptitude.service";
import AptitudeController from "@controllers/aptitude.controller";
import InterviewRepository from "@repositories/interview.repository";

const router = express.Router();

const interviewRepo = new InterviewRepository();
const questionRepo = new QuestionRepository();
const aptitudeServer = new AptitudeService(questionRepo,interviewRepo);
const aptitudeController = new AptitudeController(aptitudeServer);

router.post("/submit-aptitude", aptitudeController.submitTest);


export default router;
