import axios from "axios";
import axiosInstance from "./axiosInstance";
import { JobFormData } from "../panel/post-job/components/job-posting-form";
import { INTERVIEW_ROUTES, JOB_ROUTES } from "@/constants/apiRoutes";

export async function createJob(formData: JobFormData): Promise<any> {
  try {
    const response = await axiosInstance.post(
      JOB_ROUTES.JOB,
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

export async function fetchAllJobs(
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
): Promise<any> {
  try {
    const response = await axiosInstance.get(JOB_ROUTES.JOB, {
      params: {
        page,
        pageSize,
        search,
      },
    });
    return {
      jobs: response.data.jobs,
      total: response.data.total,
    };
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
    const response = await axiosInstance.get(`${JOB_ROUTES.JOB}/${id}`);

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
    const response = await axiosInstance.get(JOB_ROUTES.JOB_LIST_BRIEF);

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
      INTERVIEW_ROUTES.FETCH_MY_APPLICATIONS
    );

    console.log(response.data);

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
    const response = await axiosInstance.post(
      INTERVIEW_ROUTES.APPLY_INTERVIEW,
      {
        jobId,
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

export async function fetchAppliedJobStatus(jobId: string): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `${INTERVIEW_ROUTES.FETCH_APPLIED_JOBS_STATUS}/${jobId}`
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

export async function fetchPostedJobs(): Promise<any> {
  try {
    const response = await axiosInstance.get(JOB_ROUTES.POSTED_JOBS);

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
    `${JOB_ROUTES.JOB}?${queryParams}`
  );

  return response.data;
}

export interface JobFilterParams {
  type?: string;
  category?: string;
  level?: string;
  keyword?: string;
}

export async function fetchJobsFiltered(filters: any, page: number = 1, pageSize: number = 10) {
  const queryParams = new URLSearchParams({
    ...filters,
    page: page.toString(),
    pageSize: pageSize.toString()
  }).toString();

  const response = await axiosInstance.get(`${JOB_ROUTES.FILTER_JOBS}?${queryParams}`);
  return response.data; 
}

export async function fetchJobById(id: string): Promise<JobFormData> {
  try {
    const response = await axiosInstance.get(`${JOB_ROUTES.JOB}/${id}`);
    console.log("#", response.data);
    
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Failed to fetch job"
      );
    }
    throw new Error("Unknown error occurred");
  }
}

export async function updateJob(id: string, data: Partial<JobFormData>): Promise<void> {
  try {
    console.log(data);
    await axiosInstance.patch(`${JOB_ROUTES.FILTER_JOBS}/${id}`, data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response ? error.response.data.error : "Failed to update job"
      );
    }
    throw new Error("Unknown error occurred");
  }
}