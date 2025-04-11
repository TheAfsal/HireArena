import { IAptitudeQuestion, IQuestions } from "model/Question";

export default interface IQuestionRepository {
  createAptitudeTest(
    jobId: string,
    questions: IAptitudeQuestion[]
  ): Promise<IQuestions | null>;
  getQuestions(jobId: string): Promise<IQuestions | null>
}
