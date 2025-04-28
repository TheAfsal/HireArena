import axios from "axios";
import axiosInstance from "./axiosInstance";
import { AUTH_ROUTES as ROUTES } from "@/constants/apiRoutes";

export async function approveCompanyVerification(
  companyId: string
): Promise<any> {
  try {
    const response = await axiosInstance.put(
      `${ROUTES.VERIFY_BY_ADMIN}/${companyId}`,
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
      `${ROUTES.VERIFY_BY_ADMIN}/${companyId}`,
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
