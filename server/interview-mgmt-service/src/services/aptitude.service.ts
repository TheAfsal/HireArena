import { IInterviewRepository } from "@core/interfaces/repository/IInterviewRepository";
import IQuestionRepository from "@core/interfaces/repository/IQuestionRepository";
import IAptitudeService from "@core/interfaces/services/IAptitudeService";
import {
  IInterview,
  IRoundStatus,
  RoundStatus,
  RoundType,
} from "model/Interview";
import { IAptitudeQuestion, IQuestions } from "model/Question";
import SubmitTest from "../usecase/submitAptitudeTest";
import GeminiHelper from "utils/gemini.helper";
import IAptitudeTestResultRepository from "@core/interfaces/repository/IAptitudeTestResultRepository";
import {
  CreateNotification,
  FindJobsByIds,
  IsJobExist,
} from "@config/grpcClient";

class AptitudeService implements IAptitudeService {
  constructor(
    private questionsRepo: IQuestionRepository,
    private interviewRepo: IInterviewRepository,
    private aptitudeResultRepo: IAptitudeTestResultRepository
  ) {}

  async createAptitudeTest(jobId: string) {
    const questions = await GeminiHelper.generateAptitudeQuestions();

    if (!questions || questions.length === 0) {
      throw new Error("No questions generated by AI.");
    }

    const formattedQuestions: IAptitudeQuestion[] = questions.map((q: any) => ({
      q_id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    }));

    console.log(formattedQuestions);

    return await this.questionsRepo.createAptitudeTest(
      jobId,
      formattedQuestions
    );
  }

  async fetchQuestions(jobId: string): Promise<IQuestions | null> {
    return await this.questionsRepo.getQuestions(jobId);
  }

  async scheduleAptitude(interviewId: string): Promise<void> {
    const now = new Date();

    const state: IRoundStatus = {
      roundType: RoundType["Aptitude Test"],
      status: RoundStatus.Failed,
      scheduledAt: now,
      createdAt: now,
      updatedAt: now,
    };
    await this.interviewRepo.updateAptitudeTestById(interviewId, state);
    return;
  }

  async submitTest(interviewId: string, data: any): Promise<any> {
    const application = await this.interviewRepo.findApplicationById(
      interviewId
    );

    if (!application) {
      throw new Error("False Submission");
    }

    const lastState = application.state[application.state.length - 1];

    console.log("@@lastState", lastState);

    const isAptitudeRound =
      lastState?.roundType === "Aptitude Test" &&
      lastState.status === RoundStatus.Failed;

    const scheduledAt = new Date(lastState.scheduledAt!).getTime();
    const now = Date.now();
    const diffInMinutes = (now - scheduledAt) / (1000 * 60);

    const isWithinTimeLimit = diffInMinutes <= 31;

    console.log(isAptitudeRound, isWithinTimeLimit);

    if (isAptitudeRound && isWithinTimeLimit) {
      const submit = new SubmitTest(this.questionsRepo, this.interviewRepo);
      let result = await submit.submitAptitudeTest(
        interviewId,
        application.jobId,
        data
      );

      console.log("@@ test result", result);

      const storedResult = await this.aptitudeResultRepo.saveResults(result);

      console.log("@@ storedResult", storedResult);

      if (storedResult.status === RoundStatus.Completed)
        await this.interviewRepo.addAptitudeTestId(
          interviewId,
          storedResult.id,
          true
        );
      else
        await this.interviewRepo.addAptitudeTestId(
          interviewId,
          storedResult.id
        );

      console.log("@@ application ", application);

      if (storedResult.status === RoundStatus.Completed) {
        const testOptions: Array<string> = [
          "Machine Task",
          "Technical Interview",
          "Behavioral Interview",
          "Coding Challenge",
        ];

        const jobDetails = await IsJobExist(application.jobId);

        const tests = JSON.parse(jobDetails.job.testOptions);

        if (!jobDetails) throw new Error("Job not found");

        let nextTest: Partial<IRoundStatus> | null = null;
        const now = new Date();

        for (let test of testOptions) {
          if (tests[test] === true) {
            nextTest = {
              roundType: RoundType[test],
              status: RoundStatus.Pending,
              createdAt: now,
              updatedAt: now,
            };
            break;
          }
        }

        const existingJob = await FindJobsByIds([application.jobId]);

        if (!nextTest) {
          await CreateNotification({
            userId: application.candidateId,
            message: `${existingJob[0].jobTitle}'s Interview completed successfully`,
            type: "INTERVIEW_COMPLETED",
            relatedId: application.jobId,
          });
          throw new Error("No pending test found to schedule next.");
        }

        await this.interviewRepo.addNextTest(interviewId, nextTest);

        await CreateNotification({
          userId: application.candidateId,
          message: `${existingJob[0].jobTitle}'s Aptitude round completed successfully`,
          type: "INTERVIEW_COMPLETED",
          relatedId: application.jobId,
        });

        return result;
      }

      const existingJob = await FindJobsByIds([application.jobId]);

      await CreateNotification({
        userId: application.candidateId,
        message: `Failed aptitude round for ${existingJob[0].jobTitle}`,
        type: "INTERVIEW_COMPLETED",
        relatedId: application.jobId,
      });

      return result;
    } else {
      throw new Error(
        "Submission failed: Test window expired or invalid attempt."
      );
    }
  }

  // async getAptitudeResult(interviewId: string): Promise<IAptitudeTestResult> {
  //   // const responses = await this.responseRepo.getResponsesByInterviewId(
  //   //   interviewId
  //   // );
  //   // if (!responses.length) {
  //   //   throw new Error("No responses found for this interview.");
  //   // }

  //   // const correctCount = responses.filter((r) => r.isCorrect).length;
  //   // const incorrectCount = responses.length - correctCount;
  //   // const totalQuestions = await this.interviewRepo.getTotalAptitudeQuestions(
  //   //   interviewId
  //   // );
  //   // const unansweredCount = totalQuestions - responses.length;
  //   // const scorePercentage = (correctCount / totalQuestions) * 100;

  //   // const interviewRound = await this.roundRepo.getInterviewRound(
  //   //   interviewId,
  //   //   RoundType.aptitude
  //   // );

  //   // if (!interviewRound) {
  //   //   throw new Error("Aptitude test round not found.");
  //   // }

  //   // return {
  //   //   interviewId,
  //   //   totalQuestions,
  //   //   correctCount,
  //   //   incorrectCount,
  //   //   unansweredCount,
  //   //   scorePercentage: parseFloat(scorePercentage.toFixed(2)),
  //   //   roundStatus: interviewRound.status,
  //   // };
  // }
}

export default AptitudeService;
