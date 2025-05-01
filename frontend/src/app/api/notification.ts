import axios from "axios";
import axiosInstance from "./axiosInstance";
import { NOTIFICATION_ROUTES } from "@/constants/apiRoutes";

export async function fetchCandidateNotifications(
  page: number,
  pageSize: number
): Promise<any> {
  try {

    const response = await axiosInstance.get(
      `${NOTIFICATION_ROUTES.NOTIFICATION}?page=${page}&pageSize=${pageSize}`
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

export async function markNotificationAsRead(notificationId: string) {
  try {
    const response = await axiosInstance.patch(
      `${NOTIFICATION_ROUTES.MARK_AS_DONE}/${notificationId}`
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
