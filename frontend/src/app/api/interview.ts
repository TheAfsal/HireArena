import axios from "axios";
import axiosInstance from "./axiosInstance";
import { IInterview } from "@/Types/application.types";
import { INTERVIEW_ROUTES as ROUTES } from "@/constants/apiRoutes";
import { ScheduleForm } from "@/Types/interview.types";
import { IEnrichedInterview } from "../panel/schedule/page";

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

export async function fetchAllApplicationsForDashboard(): Promise<IInterview[]> {
  try {
    const response = await axiosInstance.get(
      ROUTES.FETCH_ALL_APPLICATIONS_DASHBOARD
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

export async function fetchAllApplications({
  page = 1,
  pageSize = 10,
  roundType,
}: {
  page?: number;
  pageSize?: number;
  roundType?: string;
}): Promise<{
  data: IEnrichedInterview[];
  pagination: { total: number; page: number; pageSize: number; totalPages: number };
}> {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(roundType && { roundType }),
    }).toString();

    const response = await axiosInstance.get(
      `${ROUTES.FETCH_ALL_APPLICATIONS}?${queryParams}`
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
