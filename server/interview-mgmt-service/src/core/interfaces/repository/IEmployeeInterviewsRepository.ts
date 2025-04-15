import { IEmployeeInterviews, IScheduledInterview } from "model/EmployeeInterviews";

export default interface IEmployeeInterviewsRepository {
    addScheduledInterview( employeeId: string, scheduledInterview: IScheduledInterview): Promise<IEmployeeInterviews>
}