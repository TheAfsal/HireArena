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

export async function subscribe(planId: string): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/user-service/api/subscription/create-checkout-session`,
      { planId }
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

export async function verifySubscription(sessionId: string): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/user-service/api/subscription/verify?session_id=${sessionId}`
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

export async function fetchMySubscription(): Promise<any> {
  try {
    const response = await axiosInstance.get(`/user-service/api/subscription/`);
    console.log(response.data);

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

export async function fetchSubscriptionHistory(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/user-service/api/subscription/user`
    );
    console.log(response.data);

    return response.data.subscriptions;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function fetchSubscriptionsByAdmin(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/user-service/api/admin/subscriptions`
    );
    console.log(response.data);

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
