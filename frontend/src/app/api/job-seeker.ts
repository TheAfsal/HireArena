import axios from "axios";
import axiosInstance from "./axiosInstance";

export async function fetchCandidates(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/admin-service/api/admin/candidates`
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

export async function updateJobSeekerStatus(id: string): Promise<any> {
  try {
    const response = await axiosInstance.put(
      `/user-service/api/admin/candidates`,
      { userId: id }
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
