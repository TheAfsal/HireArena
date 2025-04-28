import axios from "axios";
import axiosInstance from "./axiosInstance";
import { IInterview } from "@/Types/application.types";
import { ScheduleForm } from "../panel/schedule/page";
import { INTERVIEW_ROUTES as ROUTES } from "@/constants/apiRoutes";

export async function fetchAptitudeQuestions(
  interviewId: string
): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `${ROUTES.FETCH_APTITUDE_QUESTION}/${interviewId}`
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
      ROUTES.SUBMIT_APTITUDE_QUESTION,
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
      `${ROUTES.FETCH_APTITUDE_RESULT}/${interviewId}`
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
      `${ROUTES.FETCH_MACHINE_TASK_BY_JOB}/${jobId}`
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
      `${ROUTES.FETCH_MACHINE_TASK}/${taskId}`
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
      ROUTES.START_MACHINE_TASK,
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
      ROUTES.SUBMIT_MACHINE_TASK,
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
      ROUTES.FETCH_ALL_APPLICATIONS
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
      `${ROUTES.FETCH_JOB_APPLICATIONS}?id=${jobId}`
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

    const response = await axiosInstance.post(
      ROUTES.SCHEDULE_INTERVIEW,
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
      ROUTES.FETCH_MY_SCHEDULE
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
      ROUTES.SUBMIT_VIDEO_INTERVIEW,
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
