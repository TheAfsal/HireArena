import axios from "axios";
import axiosInstance from "./axiosInstance";

export async function createSubscription(plan: string): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `http://localhost:4000/user-service/api/subscription`,
      { plan }
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
