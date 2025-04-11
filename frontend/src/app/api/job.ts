import axios from "axios";
import axiosInstance from "./axiosInstance";
import { JobFormData } from "../panel/post-job/components/job-posting-form";

export async function createJob(formData: JobFormData): Promise<any> {
  try {
    
    const response = await axiosInstance.post(
      `/job-service/api/jobs/`,
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

export async function fetchAllJobs(): Promise<any> {
  try {
    const response = await axiosInstance.get(`/job-service/api/jobs/`);

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

export async function fetchJobDetails(id: string): Promise<any> {
  try {
    const response = await axiosInstance.get(`/job-service/api/jobs/${id}`);

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

export async function fetchJobListBrief(): Promise<any> {
  try {
    const response = await axiosInstance.get(`/job-service/api/jobs/brief`);

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

export async function fetchMyApplications(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/job-service/api/jobs/my-applications`
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

export async function applyJob(jobId: string): Promise<any> {
  
  try {
    const response = await axiosInstance.post(`/interview-mgmt-service/api/interviews/apply`, {
      jobId,
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

export async function fetchAppliedJobStatus(jobId: string): Promise<any> {
  try {
    const response = await axiosInstance.get(`/interview-mgmt-service/api/interviews/status/${jobId}`);
    
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

export async function fetchPostedJobs(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/job-service/api/jobs/company`
    );

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }

    throw new Error("Unknown error occurred");
  }
}

// Chelpo waste

export async function fetchFilteredJobs(filters: any) {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await axiosInstance.get(
    `/job-service/api/jobs?${queryParams}`
  );

  return response.data;
}

export interface JobFilterParams {
  type?: string;
  category?: string;
  level?: string;
  keyword?: string;
}

export async function fetchJobsFiltered(filters: any) {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await axiosInstance.get(
    `/job-service/api/jobs/filter?${queryParams}`
  );

  return response.data;
}