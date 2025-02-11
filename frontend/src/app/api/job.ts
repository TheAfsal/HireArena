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


