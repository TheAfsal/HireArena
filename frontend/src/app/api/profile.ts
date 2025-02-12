import axios from "axios";
import axiosInstance from "./axiosInstance";
import { CompanySocialLinks } from "../panel/settings/components/social-links-sections";

export async function updateJobSeekerProfile(formData: FormData): Promise<any> {
  try {
    const response = await axiosInstance.put(
      `http://localhost:4000/user-service/api/job-seeker/profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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

export async function fetchJobSeekerProfile(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `http://localhost:4000/user-service/api/job-seeker/profile`
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

export async function fetchJobSeekerMinimalProfile(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `http://localhost:4000/user-service/api/job-seeker/profile/minimal`
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

export async function updateCompanyProfile(formData: FormData): Promise<any> {
  try {
    const response = await axiosInstance.put(
      `http://localhost:4000/user-service/api/company/profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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

export async function fetchCompanyProfile(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `http://localhost:4000/user-service/api/company/profile`
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

export async function fetchMediaLinks(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `http://localhost:4000/user-service/api/company/media-links`
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

export async function updateMediaLinks(formData: CompanySocialLinks): Promise<any> {
  try {
    const response = await axiosInstance.put(
      `http://localhost:4000/user-service/api/company/media-links`,
      formData,
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

export async function changeJobSeekerPassword(
  oldPassword: string,
  newPassword: string
): Promise<any> {
  try {
    const response = await axiosInstance.put(
      `http://localhost:4000/user-service/api/job-seeker/change-password`,
      { oldPassword, newPassword }
    );

    return response.data;
  } catch (error: unknown) {
    console.log("1312312");
    console.log(error);

    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.message : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}
