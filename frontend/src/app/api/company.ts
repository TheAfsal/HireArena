import axios from "axios";
import axiosInstance from "./axiosInstance";
import { fetchPostedJobs } from "./job";
import { fetchAllApplicationsForDashboard } from "./interview";
import { Job } from "../dashboard/components/types/job";
import { COMPANY_ROUTES } from "@/constants/apiRoutes";

export async function fetchCompanies(
  page: number,
  pageSize: number,
  searchTerm: string
): Promise<{ companies: any[]; total: number }> {
  try {
    const response = await axiosInstance.get(
      `${
        COMPANY_ROUTES.FETCH_COMPANIES
      }?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(
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
      COMPANY_ROUTES.COMPANIES_EMPLOYEES
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
      fetchAllApplicationsForDashboard(),
    ]);
    //@ts-ignore
    return [jobs, applications];
  } catch (error) {
    throw new Error("Failed to fetch dashboard data");
  }
}
