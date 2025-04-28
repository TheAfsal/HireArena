"use client";

import axios from "axios";
import axiosInstance from "./axiosInstance";
import { AUTH_ROUTES as ROUTES } from "@/constants/apiRoutes";

interface LoginState {
  email: string;
  password: string;
  name?: string | null;
}

interface AuthResponse {
  status?: string;
  success?: boolean;
  data?: {
    tokens: {
      accessToken: string;
    };
    user: object;
  };
  error?: string;
}

export async function LoginJobSeeker(
  details: LoginState
): Promise<AuthResponse> {
  try {
    console.log(details);
    const response = await axiosInstance.post(
      `${ROUTES.LOGIN_JOBSEEKER}`,
      details
    );
    return response.data;
  } catch (error: unknown) {
    console.log(error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response ? error.response.data : "Something went wrong",
      };
    } else {
      const errorMessage =
        (error as { error: string }).error || "Something went wrong";
      // console.log(errorMessage);

      return { error: errorMessage };
    }
  }
}

export async function SignupJobSeeker(
  details: LoginState
): Promise<AuthResponse> {
  try {
    console.log(details);
    const response = await axiosInstance.post(
      `${ROUTES.SIGNUP_JOBSEEKER}`,
      details
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response ? error.response.data : "Something went wrong",
      };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}

export async function LoginCompany(details: LoginState): Promise<AuthResponse> {
  try {
    const response = await axiosInstance.post(
      `${ROUTES.LOGIN_COMPANY}`,
      details
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response ? error.response.data : "Something went wrong",
      };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}

export async function LoginAdmin(details: LoginState): Promise<AuthResponse> {
  try {
    const response = await axiosInstance.post(`${ROUTES.LOGIN_ADMIN}`, details);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response ? error.response.data : "Something went wrong",
      };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}

export async function SignupCompany(
  details: LoginState
): Promise<AuthResponse> {
  try {
    console.log(details);

    const response = await axiosInstance.post(
      `${ROUTES.SIGNUP_COMPANY}`,
      details
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response ? error.response.data : "Something went wrong",
      };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}

export async function VerifyUserEmail(
  token: string
): Promise<AuthResponse & { accessToken: string; role?: string }> {
  try {
    const response = await axiosInstance.post(
      `${ROUTES.VERIFY_EMAIL}/${token}`
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

export async function sendInvitation(inviteDetails: {
  email: string;
  message?: string;
  role: string;
}): Promise<AuthResponse & { accessToken: string; role?: string }> {
  try {
    const response = await axiosInstance.post(
      ROUTES.INVITATION_BY_COMPANY,
      inviteDetails
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

export async function fetchInvitationDetails(token: string): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `${ROUTES.INVITATION_BY_COMPANY}/${token}`
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

export async function googleToken(token: string): Promise<any> {
  try {
    const response = await axiosInstance.post(
      ROUTES.GOOGLE_TOKEN,
      { token },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data.tokens;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

export async function AcceptInvitation(
  token: string,
  name: string,
  password: string
): Promise<any> {
  try {
    const response = await axiosInstance.post(ROUTES.ACCEPT_INVITATION, {
      token,
      name,
      password,
    });

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

export async function ForgotPassword(email: string): Promise<void> {
  try {
    const response = await axiosInstance.post(ROUTES.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw {
        success: false,
        error: error.response ? error.response.data : "Something went wrong",
      };
    }
    throw { success: false, error: "Unknown error occurred" };
  }
}

export async function ConfirmToForgotPassword(
  token: string,
  newPassword: string
): Promise<void> {
  try {
    const response = await axiosInstance.post(
      `${ROUTES.CONFIRM_FORGOT_PASSWORD}/${token}`,
      { newPassword }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw {
        success: false,
        error: error.response ? error.response.data : "Something went wrong",
      };
    }
    throw { success: false, error: "Unknown error occurred" };
  }
}
