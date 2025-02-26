import axios from "axios";
import axiosInstance from "./axiosInstance";

export async function createSubscription(plan: any): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/admin-service/api/subscriptions`,
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

export async function updateSubscription(plan: any): Promise<any> {
  try {
    const response = await axiosInstance.put(
      `/admin-service/api/subscriptions/${plan.id}`,
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

export async function fetchPlans(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/admin-service/api/subscriptions`
    );

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function subscribe(plan: string): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/user-service/api/subscription`,
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
