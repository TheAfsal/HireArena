import { IQuestions } from "model/Question";

export default interface IAptitudeService {
  createAptitudeTest(jobId: string): Promise<IQuestions | null>;
  fetchQuestions(jobId: string): Promise<IQuestions | null>
  scheduleAptitude(interviewId: string): Promise<void>;
  submitTest(interviewId: string, data: any): Promise<any>
  // submitTest(
  //   interviewId: string,
  //   data: { questionId: string; selectedAnswer: string }[]
  // ): Promise<any>;

  // getAptitudeResult(interviewId: string): Promise<IAptitudeTestResult>;
}
