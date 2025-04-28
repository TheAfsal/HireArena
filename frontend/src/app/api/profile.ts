import axios from "axios";
import axiosInstance from "./axiosInstance";
import { CompanySocialLinks } from "../panel/settings/components/social-links-sections";
import { USER_ROUTES } from "@/constants/apiRoutes";

export async function updateJobSeekerProfile(formData: FormData): Promise<any> {
  try {
    const response = await axiosInstance.put(
      USER_ROUTES.JOB_SEEKER_PROFILE,
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
    const response = await axiosInstance.get(USER_ROUTES.JOB_SEEKER_PROFILE);

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
      USER_ROUTES.JOB_SEEKER_MINIMAL_PROFILE
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

export async function fetchCandidateProfile(id: string): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `${USER_ROUTES.JOB_SEEKER_MINIMAL_PROFILE}/${id}`
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
      USER_ROUTES.COMPANY_PROFILE,
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
    const response = await axiosInstance.get(USER_ROUTES.COMPANY_PROFILE);

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
    const response = await axiosInstance.get(USER_ROUTES.COMPANY_MEDIA_LINK);

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

export async function updateMediaLinks(
  formData: CompanySocialLinks
): Promise<any> {
  try {
    const response = await axiosInstance.put(
      USER_ROUTES.COMPANY_MEDIA_LINK,
      formData
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
      USER_ROUTES.CHANGE_JOB_SEEKER_PASSWORD,
      { oldPassword, newPassword }
    );

    return response.data;
  } catch (error: unknown) {
    console.log(error);

    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.message : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function getUserId(): Promise<any> {
  try {
    const response = await axiosInstance.get(USER_ROUTES.FETCH_JOB_SEEKER_ID);

    return response.data.userId;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.message : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}
