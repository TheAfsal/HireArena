"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interview_1 = require("../model/Interview");
class SubmitTest {
    constructor(questionsRepo, interviewRepo) {
        this.questionsRepo = questionsRepo;
        this.interviewRepo = interviewRepo;
    }
    async submitAptitudeTest(interviewId, jobId, responses) {
        console.log(responses);
        const validResponses = responses.filter((response) => response.selectedAnswer !== null);
        const questions = await this.questionsRepo.getQuestions(jobId);
        if (!questions || questions.aptitudeQuestions.length === 0) {
            throw new Error("No questions found for this interview.");
        }
        console.log("@@ questions", questions);
        console.log("@@ questions length", questions.aptitudeQuestions.length);
        console.log("@@ responses", responses);
        let correctCount = 0;
        let incorrectCount = 0;
        let attemptedCount = validResponses.length;
        const evaluationResults = [];
        for (const response of validResponses) {
            const question = questions.aptitudeQuestions.find((q) => q.q_id === response.questionId);
            if (!question) {
                throw new Error(`Invalid question ID: ${response.questionId}`);
            }
            const isCorrect = question.correctAnswer === response.selectedAnswer;
            // await this.responseRepo.saveCandidateResponse(
            //   interviewId,
            //   question.id,
            //   response.selectedAnswer as string,
            //   isCorrect
            // );
            isCorrect ? correctCount++ : incorrectCount++;
            evaluationResults.push({ questionId: question.q_id, isCorrect });
        }
        const unansweredCount = questions.aptitudeQuestions.length - attemptedCount;
        const totalQuestions = questions.aptitudeQuestions.length;
        const scorePercentage = (correctCount / totalQuestions) * 100;
        //@ts-ignore
        const passed = scorePercentage >= 70;
        // const interviewRound = await this.roundRepo.getInterviewRound(
        //   interviewId,
        //   RoundType.aptitude
        // );
        // if (!interviewRound) {
        //   throw new Error("Aptitude test round not found.");
        // }
        // const roundStatus = passed ? "completed" : "failed";
        // await this.roundRepo.updateInterviewRoundStatus(
        //   interviewRound.id,
        //   roundStatus
        // );
        // if (passed) {
        //   await this.interviewRepo.progressToNextRound(interviewId);
        // } else {
        //   await this.interviewRepo.updateInterviewStatus(
        //     interviewId,
        //     InterviewStatus.failed
        //   );
        // }
        // return {
        //   success: true,
        //   totalQuestions,
        //   attemptedCount,
        //   correctCount,
        //   incorrectCount,
        //   unansweredCount,
        //   scorePercentage: parseFloat(scorePercentage.toFixed(2)),
        //   passed,
        //   results: evaluationResults,
        // };
        return {
            totalQuestions,
            attemptedCount,
            scorePercentage: parseFloat(scorePercentage.toFixed(2)),
            status: passed ? Interview_1.RoundStatus.Completed : Interview_1.RoundStatus.Failed,
            results: evaluationResults,
        };
    }
}
exports.default = SubmitTest;
