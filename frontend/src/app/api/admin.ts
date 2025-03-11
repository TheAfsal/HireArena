import axios from "axios";
import axiosInstance from "./axiosInstance";

export async function approveCompanyVerification(
  companyId: string
): Promise<any> {
  try {
    const response = await axiosInstance.put(
      `/user-service/api/admin/verify/${companyId}`,
      { status: "Approved" }
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

export async function rejectCompanyVerification(
  companyId: string,
  reason: string
): Promise<any> {
  try {
    const response = await axiosInstance.put(
      `/user-service/api/admin/verify/${companyId}`,
      { status: "Rejected", rejectReason: reason }
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
