import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import EmployeeInterviewsModel, { IEmployeeInterviews, IScheduledInterview } from "model/EmployeeInterviews";
import IEmployeeInterviewsRepository from "@core/interfaces/repository/IEmployeeInterviewsRepository";

class EmployeeInterviewsRepository extends BaseRepository<IEmployeeInterviews> implements IEmployeeInterviewsRepository{
  constructor() {
    super(EmployeeInterviewsModel);
  }

  async addScheduledInterview(
    employeeId: string,
    scheduledInterview: IScheduledInterview
  ): Promise<IEmployeeInterviews> {
    return this.model
      .findOneAndUpdate(
        { employeeId },
        { $push: { interviews: scheduledInterview } },
        { upsert: true, new: true } 
      )
      .exec();
  }
}

export default EmployeeInterviewsRepository;