import axios from "axios";
import axiosInstance from "./axiosInstance";
import { SubscriptionPlan } from "../admin/subscription/components/subscription-history";
import { SUBSCRIPTION_ROUTES } from "@/constants/apiRoutes";

export async function createSubscription(plan: any): Promise<any> {
  try {
    const response = await axiosInstance.post(
      SUBSCRIPTION_ROUTES.SUBSCRIPTION,
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
      `${SUBSCRIPTION_ROUTES.SUBSCRIPTION}/${plan.id}`,
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
    const response = await axiosInstance.get(SUBSCRIPTION_ROUTES.SUBSCRIPTION);

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
      SUBSCRIPTION_ROUTES.SUBSCRIBE_CANDIDATE,
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
      `${SUBSCRIPTION_ROUTES.VERIFY_SUBSCRIPTION}=${sessionId}`
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
    const response = await axiosInstance.get(
      SUBSCRIPTION_ROUTES.MY_SUBSCRIPTION
    );
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
      SUBSCRIPTION_ROUTES.FETCH_SUBSCRIPTION_HISTORY
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

export async function fetchSubscriptionsByAdmin(
  page: number,
  pageSize: number
): Promise<{ subscriptions: SubscriptionPlan[]; total: number }> {
  try {
    const response = await axiosInstance.get(
      `${SUBSCRIPTION_ROUTES.FETCH_SUBSCRIPTION_BY_ADMIN}?page=${page}&pageSize=${pageSize}`
    );
    console.log(response.data);

    return {
      subscriptions: response.data.data.subscriptions,
      total: response.data.data.total,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }
    throw new Error("Unknown error occurred");
  }
}
