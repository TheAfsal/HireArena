import { IEmployeeInterviews, IScheduledInterview } from "model/EmployeeInterviews";

export default interface IEmployeeInterviewsRepository {
    addScheduledInterview( employeeId: string, scheduledInterview: IScheduledInterview): Promise<IEmployeeInterviews>
    findMySchedule( employeeId: string): Promise<IScheduledInterview[]>
    removeScheduledInterview( employeeId: string, scheduledInterviewId: string ): Promise<IEmployeeInterviews | null>
}