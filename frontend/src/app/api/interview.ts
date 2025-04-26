import axios from "axios";
import axiosInstance from "./axiosInstance";
import { IInterview } from "@/Types/application.types";
import { ScheduleForm } from "../panel/schedule/page";

export async function fetchAptitudeQuestions(
  interviewId: string
): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/interview-mgmt-service/api/interviews/${interviewId}`
    );

    return response.data.questions;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function submitAptitude(
  interviewId: string,
  data: { questionId: string; selectedAnswer: string | null }[]
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/interview-mgmt-service/api/interviews/aptitude/submit`,
      { interviewId, data }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function fetchAptitudeResult(interviewId: string): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/interview-mgmt-service/api/interviews/aptitude-result/${interviewId}`
    );

    return response.data.result;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function fetchMachineTaskByJobId(jobId: string): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/interview-mgmt-service/api/machine-task/job/${jobId}`
    );

    return response.data.task;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function fetchMachineTaskDetails(taskId: string): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/interview-mgmt-service/api/machine-task/${taskId}`
    );

    return response.data.task;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function startMachineTask(taskId: string): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/interview-mgmt-service/api/machine-task/start-task`,
      { taskId }
    );

    return response.data.task;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function submitMachineTask(
  taskId: string,
  repoUrl: string,
  jobId: string
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/interview-mgmt-service/api/machine-task/submit`,
      { taskId, repoUrl,jobId }
    );

    return response.data.task;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function fetchAllApplications(): Promise<IInterview[]> {
  try {
    const response = await axiosInstance.get(
      `/interview-mgmt-service/api/interviews/company-applications`
    );

    console.log("@@ company all applications ", response.data);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function fetchJobApplications(jobId:string): Promise<IInterview[]> {
  try {
    const response = await axiosInstance.get(
      `/interview-mgmt-service/api/interviews/job-applications?id=${jobId}`
    );

    console.log("@@ company all applications ", response.data);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function scheduleInterview(form: ScheduleForm): Promise<any> {
  try {
    console.log(form);

    const response = await axiosInstance.post(
      `/interview-mgmt-service/api/interviews/schedule`,
      { form }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function fetchMySchedule(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/interview-mgmt-service/api/interviews/schedule`
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function submitVideoInterview(
  interviewId: string,
  candidateId: string,
  remarks: string,
  status: string
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/interview-mgmt-service/api/interviews/submit-video-call-interview`,
      { interviewId, candidateId, remarks, status }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}
