import axios from "axios";
import axiosInstance from "./axiosInstance";
import { fetchMyApplications } from "./job";

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

// export async function fetchDashboardDataForCandidate(): Promise<any> {
//   try {
//     let response =  await fetchMyApplications();
//     console.log(response);
    
//   } catch (error) {
//     throw new Error("Failed to fetch dashboard data");
//   }
// }

export async function fetchDashboardDataForCandidate(): Promise<any[]> {
  try {
    const response = await fetchMyApplications();
    console.log(response);
    
    const data = response;
    if (!Array.isArray(data)) {
      console.warn("API response is not an array:", data);
      return [];
    }
    return data;
  } catch (error: unknown) {
    console.error("Error fetching candidate applications:", error);
    throw new Error("Failed to fetch candidate dashboard data");
  }
}
