import axios from "axios";
import axiosInstance from "./axiosInstance";

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

