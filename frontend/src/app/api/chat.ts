import axios from "axios";
import axiosInstance from "./axiosInstance";
import { CHAT_ROUTES as ROUTES } from "@/constants/apiRoutes";

export async function fetchMyChats(): Promise<any> {
  try {
    const response = await axiosInstance.get(ROUTES.MY_CHATS);

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

export async function fetchCompanyChats(): Promise<any> {
  try {
    const response = await axiosInstance.get(ROUTES.COMPANY_CHATS);

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
