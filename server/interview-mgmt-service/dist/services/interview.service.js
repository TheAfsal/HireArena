"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewService = void 0;
const grpcClient_1 = require("../config/grpcClient");
const Interview_1 = require("../model/Interview");
const uuid_1 = require("uuid");
class InterviewService {
    constructor(interviewRepo, employeeInterviewsRepo) {
        this.interviewRepo = interviewRepo;
        this.employeeInterviewsRepo = employeeInterviewsRepo;
    }
    // async fetchAptitudeQuestions(interviewId: string): Promise<AptitudeTestQuestion[] | string> {
    //   return this.interviewRepository.getAptitudeQuestions(interviewId);
    // }
    // async fetchAppliedJobStatus(jobId: string, userId: string): Promise<string> {
    //   const interview =
    //     await this.interviewRepository.getInterviewStatusByApplication(
    //       jobId,
    //       userId
    //     );
    //   if (!interview) {
    //     throw new Error("No interview found for this application.");
    //   }
    //   return interview.status;
    // }
    // Making changes
    async applyForJob(jobId, jobSeekerId, jobDetails) {
        const existingApplication = await this.interviewRepo.findApplication(jobId, jobSeekerId);
        if (existingApplication)
            throw new Error("You have already applied for this job");
        const testOptions = [
            "Aptitude Test",
            "Machine Task",
            "Technical Interview",
            "Behavioral Interview",
            "Coding Challenge",
        ];
        const now = new Date();
        const applicationData = {
            jobId,
            candidateId: jobSeekerId,
            scheduledAt: now,
            createdAt: now,
            updatedAt: now,
        };
        for (let test of testOptions) {
            if (jobDetails.testOptions[test] === true) {
                applicationData.state = [
                    {
                        roundType: Interview_1.RoundType[test],
                        status: Interview_1.RoundStatus.Scheduled,
                        createdAt: now,
                        updatedAt: now,
                    },
                ];
                if ([
                    "Technical Interview",
                    "Behavioral Interview",
                    "Coding Challenge",
                ].includes(test)) {
                    applicationData.state[0].status = Interview_1.RoundStatus.Pending;
                    applicationData.state[0].scheduledAt = now;
                }
                break;
            }
        }
        return await this.interviewRepo.createApplication(applicationData);
    }
    async getApplicationsStatus(jobSeekerId, jobId) {
        return await this.interviewRepo.findApplication(jobId, jobSeekerId);
    }
    async findApplicationById(interviewId) {
        return await this.interviewRepo.findApplicationById(interviewId);
    }
    async getAllApplications(userId, companyId) {
        const jobs = await (0, grpcClient_1.FindJobIdsByCompanyId)(companyId);
        if (!jobs?.length) {
            return [];
        }
        console.log("@@ job ids from job-server ", jobs);
        return await this.interviewRepo.findApplicationByJobId(jobs);
    }
    async getApplicationsCandidate(userId) {
        const interviews = await this.interviewRepo.findApplicationByCandidateId(userId);
        if (!interviews.length)
            return [];
        const jobIds = interviews.map((interview) => interview.jobId);
        const jobs = await (0, grpcClient_1.FindJobsByIds)(jobIds);
        const interviewsWithJobs = interviews.map((interview) => {
            const job = jobs.find((j) => j.id === interview.jobId);
            return {
                ...interview.toObject(),
                jobDetails: job
                    ? {
                        jobId: job.id,
                        title: job.jobTitle,
                        testOptions: job.testOptions,
                        description: job.jobDescription,
                    }
                    : undefined,
            };
        });
        return interviewsWithJobs;
    }
    async getScheduleInterviews(userId) {
        return await this.employeeInterviewsRepo.findMySchedule(userId);
    }
    async scheduleInterview(interviewId, employeeId, roundType, scheduledAt) {
        try {
            // const scheduledInterviewId = Math.random().toString(36).substring(2, 10);
            const scheduledInterviewId = (0, uuid_1.v4)();
            const videoCallLink = `http://localhost:3000/job-seeker/video-call/meeting/${scheduledInterviewId}`;
            const scheduledInterview = {
                scheduledInterviewId: interviewId,
                candidateId: "",
                time: scheduledAt,
                link: videoCallLink,
            };
            const interview = await this.interviewRepo.findApplicationById(interviewId);
            if (!interview) {
                throw new Error("Interview not found");
            }
            scheduledInterview.candidateId = interview.candidateId;
            const updatedScheduledInterview = await this.employeeInterviewsRepo.addScheduledInterview(employeeId, scheduledInterview);
            const schema = {
                INTERVIEWER: "Technical Interview",
            };
            const roundData = {
                roundType: schema[roundType],
                status: Interview_1.RoundStatus.Scheduled,
                scheduledAt,
                scheduledInterviewId: updatedScheduledInterview.interviews[updatedScheduledInterview.interviews.length - 1]["_id"],
                videoCallLink,
            };
            const updatedInterview = await this.interviewRepo.addInterviewRound(interviewId, roundData);
            if (!updatedInterview) {
                throw new Error("Failed to update interview");
            }
            return updatedInterview;
        }
        catch (error) {
            console.log(error);
            throw new Error(`Failed to schedule interview: ${error.message}`);
        }
    }
    async submitVideoInterview(interviewId, candidateId, employeeId, remarks, status) {
        try {
            const interview = await this.interviewRepo.findApplicationById(interviewId);
            if (!interview || !interview.state.length) {
                throw new Error("Interview not found or state array is empty");
            }
            const lastRound = interview.state[interview.state.length - 1];
            const scheduledInterviewId = lastRound.scheduledInterviewId;
            if (!scheduledInterviewId) {
                throw new Error("No scheduled interview found to submit");
            }
            const roundData = {
                //@ts-ignore
                ...lastRound.toObject(),
                status,
                remarks,
                completedAt: new Date(),
                scheduledInterviewId: null,
                videoCallLink: null,
            };
            const updatedInterview = await this.interviewRepo.submitVideoInterview(interviewId, candidateId, roundData);
            if (!updatedInterview) {
                throw new Error("Failed to update interview");
            }
            const updatedEmployeeSchedule = await this.employeeInterviewsRepo.removeScheduledInterview(employeeId, scheduledInterviewId);
            if (!updatedEmployeeSchedule) {
                throw new Error("Failed to update employee schedule");
            }
            if (updatedInterview.state[updatedInterview.state.length - 1].status ===
                Interview_1.RoundStatus.Completed) {
                const testOptions = [
                    "Technical Interview",
                    "Behavioral Interview",
                    "HR Interview",
                ];
                console.log("@@ testOptions", testOptions);
                console.log("@@ updatedInterview", updatedInterview);
                const jobDetails = await (0, grpcClient_1.IsJobExist)(updatedInterview.jobId);
                const tests = JSON.parse(jobDetails.job.testOptions);
                console.log("@@ test from job-server: ", tests);
                if (!jobDetails)
                    throw new Error("Job not found");
                const priorityOrder = [
                    "Aptitude Test",
                    "Machine Task",
                    "Coding Challenge",
                    "Technical Interview",
                    "Behavioral Interview",
                    "HR Interview",
                    "CEO Interview",
                ];
                const filteredArr = priorityOrder.filter((task) => tests[task] === true);
                console.log("@@filteredArr ", filteredArr);
                let nextTest = null;
                const now = new Date();
                if (updatedInterview.state.length === filteredArr.length) {
                    console.log("Interview Completed");
                    return updatedInterview;
                }
                else {
                    nextTest = {
                        roundType: Interview_1.RoundType[filteredArr[updatedInterview.state.length]],
                        status: Interview_1.RoundStatus.Pending,
                        createdAt: now,
                        updatedAt: now,
                    };
                    console.log(nextTest);
                    if (!nextTest) {
                        throw new Error("No pending test found to schedule next.");
                    }
                    return await this.interviewRepo.addNextTest(interviewId, nextTest);
                }
            }
            return updatedInterview;
        }
        catch (error) {
            console.log(error);
            throw new Error(`Failed to submit video interview: ${error.message}`);
        }
        // async getCompanyDetailsById(
        //   companyIds: string[],
        //   callback: grpc.sendUnaryData<{ companies: any[] }>
        // ): Promise<void> {
        //   this.companyRepository
        //     .findByIds(companyIds)
        //     .then((details: ICompany[]) => {
        //       if (details.length) {
        //         console.log(details);
        //         callback(null, { companies: details });
        //       } else {
        //         callback({
        //           code: grpc.status.NOT_FOUND,
        //           details: "Companies not found",
        //         });
        //       }
        //     })
        //     .catch((err: Error) => {
        //       callback({
        //         code: grpc.status.INTERNAL,
        //         details: err.message,
        //       });
        //     });
        // }
    }
}
exports.InterviewService = InterviewService;
exports.default = InterviewService;
