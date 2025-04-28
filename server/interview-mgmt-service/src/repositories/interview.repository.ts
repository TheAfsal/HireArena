import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import InterviewModel, {
  IInterview,
  IRoundStatus,
  RoundStatus,
} from "model/Interview";
import { IInterviewRepository } from "@core/interfaces/repository/IInterviewRepository";
import { PaginationOptions } from "@services/interview.service";
class InterviewRepository
  extends BaseRepository<IInterview, string>
  implements IInterviewRepository
{
  constructor(interviewModel: Model<IInterview> = InterviewModel) {
    super(interviewModel);
  }

  async findApplicationById(interviewId: string): Promise<IInterview | null> {
    return this.model.findOne({ _id: interviewId }).exec();
  }

  async findApplication(
    jobId: string,
    jobSeekerId: string
  ): Promise<IInterview | null> {
    return this.model.findOne({ jobId, candidateId: jobSeekerId }).exec();
  }

  async findApplicationByCandidateId(
    candidateId: string
  ): Promise<IInterview[]> {
    return this.model.find({ candidateId }).exec();
  }

  async createApplication(
    jobDetails: Partial<IInterview>
  ): Promise<IInterview> {
    return await this.save(jobDetails);
  }

  async updateAptitudeTestById(
    interviewId: string,
    state: IRoundStatus
  ): Promise<void> {
    this.model
      .findByIdAndUpdate(interviewId, { $set: { "state.0": state } })
      .exec();
  }

  async addAptitudeTestId(
    interviewId: string,
    testResultId: string,
    completed?: boolean
  ): Promise<void> {
    const update: any = {
      "state.0.aptitudeTestResultId": testResultId,
    };

    if (completed) {
      update["state.0.status"] = RoundStatus.Completed;
    }

    await this.model
      .findByIdAndUpdate(interviewId, {
        $set: update,
      })
      .exec();
  }

  async addNextTest(
    interviewId: string,
    newTest: Partial<IRoundStatus>
  ): Promise<any> {
    this.model
      .findByIdAndUpdate(
        interviewId,
        {
          $push: { state: newTest },
        },
        { new: true }
      )
      .exec();
  }

  async findApplicationByJobId(jobs: string[], options: PaginationOptions): Promise<{
    applications: IInterview[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { page = 1, pageSize = 10, roundType } = options;
    const skip = (page - 1) * pageSize;

    const query: any = { jobId: { $in: jobs } };
    if (roundType) {
      query["state.roundType"] = roundType; 
    }

    const [applications, total] = await Promise.all([
      this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.model.countDocuments(query).exec(),
    ]);

    return {
      applications,
      total,
      page,
      pageSize,
    };
  }

  async getJobApplications(jobs: string[]): Promise<IInterview[]> {
    return this.model
      .find({ jobId: { $in: jobs } })
      .sort({ createdAt: -1 })
      .exec();
  }

  async addInterviewRound(
    interviewId: string,
    roundData: Partial<IInterview["state"][0]>
  ): Promise<IInterview | null> {

    const interview = await this.model.findById(interviewId).exec();
    if (!interview || !interview.state.length) {
      throw new Error("Interview not found or state array is empty");
    }

    const lastIndex = interview.state.length - 1;
    const updateResult = await this.model
      .findByIdAndUpdate(
        interviewId,
        { $set: { [`state.${lastIndex}`]: roundData } },
        { new: true }
      )
      .exec();

    console.log("Updated document:", updateResult);
    return updateResult;
  }

  async submitVideoInterview(
    interviewId: string,
    candidateId: string,
    roundData: Partial<IInterview["state"][0]>
  ): Promise<IInterview | null> {
    const interview = await this.model
      .findOne({ _id: interviewId, candidateId })
      .exec();
    if (!interview || !interview.state.length) {
      throw new Error("Interview not found or state array is empty");
    }

    const lastIndex = interview.state.length - 1;
    return this.model
      .findOneAndUpdate(
        { _id: interviewId, candidateId },
        {
          $set: {
            [`state.${lastIndex}`]: roundData,
            updatedAt: new Date(),
          },
        },
        { new: true }
      )
      .exec();
  }

  async updateMachineTaskStatus(
    candidateId: string,
    jobId: string,
    taskId: string,
    status: RoundStatus
  ): Promise<any> {

    const interview = await this.model
      .findOne({ jobId, candidateId })
      .exec();
    if (!interview || !interview.state.length) {
      throw new Error("Interview not found or state array is empty");
    }

    const lastIndex = interview.state.length - 1;

    return await this.model.findOneAndUpdate(
      { candidateId, jobId },
      {
        $set: {
          [`state.${lastIndex}.status`]: status,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
  }

  // async getAptitudeQuestions(interviewId: string): Promise<IAptitudeTestQuestion[] | string> {
  //   const interview = await this.findById(interviewId);
  //   if (!interview) throw new Error("Interview not found");

  //   const aptitudeTemplate = await AptitudeTestTemplateModel.findOne({ jobId: interview.jobId }).exec();
  //   if (!aptitudeTemplate) throw new Error("Aptitude test not found for this job");

  //   const attemptedQuestions = await CandidateResponseModel.findOne({ interviewId }).exec();
  //   if (attemptedQuestions) return "Aptitude test already attempted.";

  //   return AptitudeTestQuestionModel.find({ templateId: aptitudeTemplate._id }).exec();
  // }

  // async getQuestionsByInterviewId(interviewId: string): Promise<IAptitudeTestQuestion[]> {
  //   const interview = await this.findById(interviewId);
  //   if (!interview) throw new Error("Interview not found");

  //   const templates = await AptitudeTestTemplateModel.find({ jobId: interview.jobId }).exec();
  //   const templateIds = templates.map(t => t._id);
  //   return AptitudeTestQuestionModel.find({ templateId: { $in: templateIds } }).exec();
  // }

  // async progressToNextRound(interviewId: string): Promise<IInterview> {
  //   const updated = await this.update(interviewId, { status: InterviewStatus.Scheduled });
  //   if (!updated) throw new Error("Interview not found");
  //   return updated;
  // }

  // async updateInterviewStatus(interviewId: string, status: InterviewStatus): Promise<IInterview> {
  //   const updated = await this.update(interviewId, { status });
  //   if (!updated) throw new Error("Interview not found");
  //   return updated;
  // }

  // async getTotalAptitudeQuestions(interviewId: string): Promise<number> {
  //   const interview = await this.findById(interviewId);
  //   if (!interview) throw new Error("Interview not found");

  //   const templates = await AptitudeTestTemplateModel.find({ jobId: interview.jobId }).exec();
  //   const templateIds = templates.map(t => t._id);
  //   const questions = await AptitudeTestQuestionModel.find({ templateId: { $in: templateIds } }).exec();
  //   return questions.length;
  // }

  // async getInterviewStatusByApplication(jobId: string, userId: string): Promise<IInterviewStatus | null> {
  //   const interview = await this.model
  //     .findOne({ jobId, candidateId: userId })
  //     .select("id status")
  //     .exec();
  //   return interview ? { id: interview.id, status: interview.status } : null;
  // }

  // async getInterviewRounds(applicationId: string): Promise<any | null> {
  //   const interview = await this.model
  //     .findOne({ applicationId })
  //     .populate("InterviewRounds", "status")
  //     .exec();
  //   return interview ? { InterviewRounds: (interview as any).InterviewRounds } : null;
  // }
}

export default InterviewRepository;
