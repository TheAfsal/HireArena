import axios from "axios";
import axiosInstance from "./axiosInstance";

// CategoryType
export async function AddCategoryType(
  name: string,
  description: string
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/job-service/api/categories/create`,
      { name, description }
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

export async function EditCategoryType(
  name: string,
  description: string,
  id: string,
  status: boolean
): Promise<any> {
  try {
    const response = await axiosInstance.put(
      `/job-service/api/categories/update`,
      { name, description, id, status }
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

export async function fetchCategoryType(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/job-service/api/categories/`
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

// Job Category
export async function AddJobCategory(
  name: string,
  description: string,
  categoryType: string
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/job-service/api/job-categories/create`,
      { name, description, categoryTypeId: categoryType }
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

export async function EditJobCategory(
  id: string,
  name: string,
  description: string,
  status: boolean,
  categoryType: string
): Promise<any> {
  try {
    const response = await axiosInstance.put(
      `/job-service/api/job-categories/update`,
      { name, description, id, status, categoryTypeId: categoryType }
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

export async function fetchJobCategory(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/job-service/api/job-categories/`
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

// Tech Stacks
export async function AddTechStack(name: string): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/job-service/api/tech-stacks/create`,
      { name }
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

export async function EditTechStack(id: string, name: string): Promise<any> {
  try {
    const response = await axiosInstance.put(
      `/job-service/api/tech-stacks/update`,
      { name, id }
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

export async function fetchTechStack(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/job-service/api/tech-stacks/`
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

// Skills
export async function AddSkills(
  name: string,
  jobCategoryId: string
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/job-service/api/skills/create`,
      { name, jobCategoryId }
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

export async function EditSkills(id: string, name: string): Promise<any> {
  try {
    const response = await axiosInstance.put(
      `/job-service/api/skills/update`,
      { name, id }
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

export async function fetchSkills(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `/job-service/api/skills/`
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
