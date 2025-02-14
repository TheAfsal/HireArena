import axios from "axios";
import axiosInstance from "./axiosInstance";
import { JobFormData } from "../panel/post-job/components/job-posting-form";

export async function createJob(formData: JobFormData): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `http://localhost:4000/job-service/api/jobs/`,
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
    const response = await axiosInstance.get(
      `http://localhost:4000/job-service/api/jobs/`
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

export async function fetchJobDetails(id: string): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `http://localhost:4000/job-service/api/jobs/${id}`
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

export async function fetchJobListBrief(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `http://localhost:4000/job-service/api/jobs/brief`
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

export async function fetchMyApplications(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `http://localhost:4000/job-service/api/jobs/my-applications`
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
    const response = await axiosInstance.post(
      `http://localhost:4000/job-service/api/jobs/apply`,
      { jobId }
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

// Chelpo waste

export async function fetchFilteredJobs(filters: any) {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await axiosInstance.get(`http://localhost:4000/job-service/api/jobs?${queryParams}`);
  
  return response.data;
}

// export async function createJob(formData: JobFormData): Promise<any> {
//   try {
//     const response = await axiosInstance.get(
//       `http://localhost:4000/job-service/api/jobs/`
//     );

//     console.log(response.data);

//     return response.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(
//         error.response ? error.response.data.error : "Something went wrong"
//       );
//     }

//     throw new Error("Unknown error occurred");
//   }
// }
