"use client";

import { googleToken } from "@/app/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { loginSuccess } from "@/redux/slices/authSlice";

export default function GoogleLoginPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleToken = async () => {
      try {
        if (token) {
          let accessToken = await googleToken(token);

          console.log("response", accessToken);

          if (accessToken) {
            localStorage.setItem("authToken", accessToken);
            dispatch(
              loginSuccess({
                user: "user",
                token: accessToken,
                role: "job-seeker",
              })
            );
          }
          setTimeout(() => {
            router.push("/job-seeker");
          }, 0);
        } else {
          // router.push("/login");
        }
      } catch (error) {
        console.error("Error during Google token processing:", error);
        // router.push("/login");
      }
    };

    handleToken();
  }, [token, router]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
