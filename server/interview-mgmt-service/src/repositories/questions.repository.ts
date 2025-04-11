import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import QuestionModel, { IAptitudeQuestion, IQuestions } from "model/Question";
import IQuestionRepository from "@core/interfaces/repository/IQuestionRepository";

class QuestionRepository
  extends BaseRepository<IQuestions, string>
  implements IQuestionRepository
{
  constructor(questionModel: Model<IQuestions> = QuestionModel) {
    super(questionModel);
  }

  async createAptitudeTest(
    jobId: string,
    questions: IAptitudeQuestion[]
  ): Promise<IQuestions | null> {
    return await this.save({ jobId, aptitudeQuestions: questions })
  }

  async getQuestions(jobId: string): Promise<IQuestions | null> {
    return await this.model.findOne({jobId}).lean();

    // const aptitudeTemplate = await this.model.findOne({ jobId: interview.jobId }).exec();
    // if (!aptitudeTemplate) throw new Error("Aptitude test not found for this job");

    // const attemptedQuestions = await this.model.findOne({ interviewId }).exec();
    // if (attemptedQuestions) return "Aptitude test already attempted.";
  }
}

export default QuestionRepository;
