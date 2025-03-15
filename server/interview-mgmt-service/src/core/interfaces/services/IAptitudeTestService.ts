import { IAptitudeTestResult } from "@core/types/interview.types";

export interface IAptitudeTestService {
  submitTest(
    interviewId: string,
    data: { questionId: string; selectedAnswer: string }[]
  ): Promise<any>;

  getAptitudeResult(interviewId: string): Promise<IAptitudeTestResult>;
}