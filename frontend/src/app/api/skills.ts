import axios from "axios";
import axiosInstance from "./axiosInstance";
import { SKILL_ROUTES } from "@/constants/apiRoutes";

// CategoryType
export async function AddCategoryType(
  name: string,
  description: string
): Promise<any> {
  try {
    const response = await axiosInstance.post(SKILL_ROUTES.ADD_CATEGORY_TYPE, {
      name,
      description,
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

export async function EditCategoryType(
  name: string,
  description: string,
  id: string,
  status: boolean
): Promise<any> {
  try {
    const response = await axiosInstance.put(SKILL_ROUTES.EDIT_CATEGORY_TYPE, {
      name,
      description,
      id,
      status,
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

export async function fetchCategoryType(): Promise<any> {
  try {
    const response = await axiosInstance.get(SKILL_ROUTES.CATEGORY_TYPE);

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
      SKILL_ROUTES.CREATE_CATEGORIES,
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
      SKILL_ROUTES.EDIT_CATEGORIES,
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
      SKILL_ROUTES.CATEGORIES,
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
      SKILL_ROUTES.ADD_TECH_STACK,
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
      SKILL_ROUTES.EDIT_TECH_STACK,
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
    const response = await axiosInstance.get(SKILL_ROUTES.TECH_STACK);

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
      SKILL_ROUTES.ADD_SKILLS,
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
    const response = await axiosInstance.put(SKILL_ROUTES.EDIT_SKILLS, {
      name,
      id,
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

export async function fetchSkills(): Promise<any> {
  try {
    const response = await axiosInstance.get(SKILL_ROUTES.SKILLS);

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
