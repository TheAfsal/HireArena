import axios from "axios";
import axiosInstance from "./axiosInstance";

export async function fetchMyChats(): Promise<any> {
  try {
    const response = await axiosInstance.get(`/chat-service/api/chats`);

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
    const response = await axiosInstance.get(`/chat-service/api/chats/company`);

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
