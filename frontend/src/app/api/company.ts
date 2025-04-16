import axios from "axios";
import axiosInstance from "./axiosInstance";
import { fetchPostedJobs } from "./job";
import { fetchAllApplications } from "./interview";
import { Job } from "../dashboard/components/types/job";

// export async function fetchCompanies(): Promise<any> {
//   try {
//     const response = await axiosInstance.get(
//       `/user-service/api/admin/companies`
//     );

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

export async function fetchCompanies(
  page: number,
  pageSize: number,
  searchTerm: string
): Promise<{ companies: any[]; total: number }> {
  try {
    const response = await axiosInstance.get(
      `/user-service/api/admin/companies?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(
        searchTerm
      )}`
    );

    return {
      companies: response.data.companies,
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

export async function getEmployeesInCompany(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/user-service/api/company/employees`
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

// export async function fetchDashboardData(): Promise<any> {
//   return new Promise((res,rej)=>{
//     Promise.all([fetchPostedJobs(),fetchAllApplications()]).then((response)=>{
//       res(response);
//     })
//   })
// }

interface Application {
  _id: string;
  candidateId: string;
  jobId: string;
  state: { status: string; updatedAt: string }[];
}

export async function fetchDashboardData(): Promise<[Job[], Application[]]> {
  try {
    const [jobs, applications] = await Promise.all([
      fetchPostedJobs(),
      fetchAllApplications(),
    ]);
    //@ts-ignore
    return [jobs, applications];
  } catch (error) {
    throw new Error("Failed to fetch dashboard data");
  }
}
