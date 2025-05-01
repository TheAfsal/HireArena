import axios from "axios";
import axiosInstance from "./axiosInstance";
import { fetchMyApplications } from "./job";
import { ADMIN_ROUTES } from "@/constants/apiRoutes";
import { fetchCandidateNotifications } from "./notification";

export async function fetchCandidates(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      ADMIN_ROUTES.FETCH_CANDIDATES_BY_ADMIN
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
      ADMIN_ROUTES.UPDATE_CANDIDATES_STATUS_BY_ADMIN,
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

export async function fetchDashboardDataForCandidate(): Promise<any[]> {
  try {
    const details = await Promise.all([
      fetchMyApplications(),
      fetchCandidateNotifications(1,10),
    ]);

    return details;
  } catch (err) {
    console.error("Error fetching candidate dashboard data:", err);
    throw new Error("Failed to fetch candidate dashboard data");
  }
}

