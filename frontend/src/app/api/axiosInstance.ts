"use client";

import { BASE_URL, USER_ROUTES } from "@/constants/apiRoutes";
import axios from "axios";

const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}${USER_ROUTES.REFRESH_TOKEN}`,
      {},
      { withCredentials: true }
    );

    const { accessToken } = response.data.data.tokens;
    localStorage.setItem("authToken", accessToken);

    return accessToken;
  } catch (error) {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
    return null;
  }
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();

        console.log(newAccessToken);

        //@ts-ignore
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest);
        }
      } catch (err) {
        window.location.href = "/login";
        return;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
