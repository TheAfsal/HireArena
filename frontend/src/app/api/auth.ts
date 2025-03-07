"use client";

import axios from "axios";
import axiosInstance from "./axiosInstance";

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

// JobSeeker Login function
export async function LoginJobSeeker(
  details: LoginState
): Promise<AuthResponse> {
  try {
    console.log(details);
    const response = await axiosInstance.post(
      "/user-service/auth/api/auth/login",
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

// JobSeeker Signup function
export async function SignupJobSeeker(
  details: LoginState
): Promise<AuthResponse> {
  try {
    console.log(details);
    const response = await axiosInstance.post(
      "/user-service/auth/api/auth/signup",
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

// Company Login function
export async function LoginCompany(details: LoginState): Promise<AuthResponse> {
  try {
    console.log("------details");
    const response = await axiosInstance.post(
      "/user-service/auth/api/auth/company-login",
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
    const response = await axiosInstance.post(
      "/user-service/auth/api/auth/admin-login",
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

export async function SignupCompany(
  details: LoginState
): Promise<AuthResponse> {
  try {
    console.log(details);

    const response = await axiosInstance.post(
      "/user-service/auth/api/auth/company-signup",
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
      `/user-service/auth/api/auth/verify-email/${token}`
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
      "/user-service/api/company/invite",
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
      `/user-service/api/company/invite/${token}`
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
      `/user-service/api/auth/refresh-token-google`,
      { token },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data.data.tokens);

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
    const response = await axiosInstance.post(
      `/user-service/api/company/accept-invite`,
      { token, name, password }
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
