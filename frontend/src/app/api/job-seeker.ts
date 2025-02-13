import axios from "axios";
import axiosInstance from "./axiosInstance";

export async function fetchCandidates(): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `http://localhost:4000/job-service/api/jobs/`,
    //   formData
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



