import axios from "axios";
import axiosInstance from "./axiosInstance";

export async function fetchAptitudeQuestions(
  interviewId: string
): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/interview-mgmt-service/api/interviews/questions/${interviewId}`
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

export async function submitAptitude(
  interviewId: string,
  data: { questionId: string; selectedAnswer: string | null }[]
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/interview-mgmt-service/api/interviews/submit-aptitude`,
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
