"use client";

import React, { useState } from "react";
import {
  LoginCompany,
  LoginJobSeeker,
  SignupCompany,
  SignupJobSeeker,
} from "@/app/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { loginFailure, loginSuccess } from "@/redux/slices/authSlice";
import { toast } from "sonner";

type FormType = "job-seeker" | "company";
type FormState = "login" | "signup";

interface FormValues {
  email: string;
  password: string;
  name?: string;
  companyName?: string;
}

function AuthForm() {
  const [formType, setFormType] = useState<FormType>("job-seeker");
  const [formState, setFormState] = useState<FormState>("signup");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
    name: "",
  });

  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);

    // Basic validation before submitting the form
    const errors: string[] = [];

    // Validate the fields (email, password, etc.)
    if (
      !formValues.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)
    ) {
      errors.push("Please enter a valid email address.");
    }

    if (!formValues.password || formValues.password.length < 6) {
      errors.push("Password must be at least 6 characters long.");
    }

    // For signup, additional validation like name is required
    if (formState === "signup" && !formValues.name?.trim()) {
      errors.push("Name is required.");
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(" "));
      return;
    }

    console.log(formState, formType);

    if (formState === "login") {
      if (formType === "job-seeker") {
        const response = await LoginJobSeeker(formValues);
        if (response.status === "success") {
          const { accessToken } = response.data!.tokens ;
          const { user } = response.data!;

          if (accessToken) {
            localStorage.setItem("authToken", accessToken);
            dispatch(
              loginSuccess({ user, token: accessToken, role: formType })
            );
          }
          setTimeout(() => {
            router.push("/job-seeker");
          }, 0);
        } else {
          console.log("response");
          console.log(response);
          const errorMessage =
            typeof response === "string"
              ? "Login failed"
              : //@ts-ignore
                response?.error?.error || "Login failed";
          setErrorMessage(errorMessage);
          dispatch(loginFailure(errorMessage));
        }
      } else {
        const response = await LoginCompany(formValues);

        if (response.status === "success") {
          const { accessToken } = response.data!.tokens;
          const { user } = response.data!;

          if (accessToken) {
            localStorage.setItem("authToken", accessToken);
            dispatch(
              loginSuccess({ user, token: accessToken, role: formType })
            );
          }
          setTimeout(() => {
            router.push("/panel");
          }, 0);
        } else {
          const errorMessage =
            typeof response === "string"
              ? "Login failed"
              : //@ts-ignore
                response?.error.error || "Login failed";
          setErrorMessage(errorMessage);
          dispatch(loginFailure(errorMessage));
        }
      }
    } else if (formState === "signup") {
      let response;
      if (formType === "job-seeker") {
        response = await SignupJobSeeker(formValues);
        if (response.status === "success") {
          //@ts-ignore
          toast(response.message);
        } else {
          const errorMessage =
            typeof response === "string"
              ? "Signup failed"
              : response?.error || "Signup failed";
          //@ts-ignore
          setErrorMessage(errorMessage.error);
          dispatch(loginFailure(errorMessage));
        }
      } else {
        response = await SignupCompany(formValues);
        if (response.status === "success") {
          //   const { accessToken } = response.data!.tokens;
          //   const { user } = response.data!;
          //   if (accessToken) {
          //     localStorage.setItem("authToken", accessToken);
          //     dispatch(
          //       loginSuccess({ user, token: accessToken, role: "company" })
          //     );
          //   }
          // setTimeout(() => {
          //   router.push("/panel");
          // }, 0);
        } else {
          const errorMessage =
            typeof response === "string"
              ? "Signup failed"
              : //@ts-ignore
                response?.error?.error || "Signup failed";
          setErrorMessage(errorMessage);
          dispatch(loginFailure(errorMessage));
        }
      }

      // if (response.status === "success") {
      //   const { accessToken } = response.data!.tokens;
      //   const { user } = response.data!;

      //   if (accessToken) {
      //     localStorage.setItem("authToken", accessToken);
      //     dispatch(
      //       loginSuccess({ user, token: accessToken, role: "job-seeker" })
      //     );
      //   }

      //   setTimeout(() => {
      //     // router.push("/panel");
      //     formType === "job-seeker" ? router.push("/") : router.push("/panel");
      //   }, 0);
      // } else {
      //   const errorMessage =
      //     typeof response === "string"
      //       ? "Signup failed"
      //       : response?.error || "Signup failed";
      //   setErrorMessage(errorMessage);
      //   dispatch(loginFailure(errorMessage));
      // }
    } else {
      setErrorMessage("Something went wrong");
    }
  };

  const googleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-6 p-4">
        <div
          className={`${
            formType === "job-seeker" ? "bg-themePurple/10" : ""
          } px-6 py-4 rounded cursor-pointer`}
        >
          <span
            className="text-themePurple text-lg font-medium"
            onClick={() => setFormType("job-seeker")}
          >
            Job Seeker
          </span>
        </div>
        <div
          className={`${
            formType === "company" ? "bg-themePurple/10" : ""
          } px-6 py-4 rounded cursor-pointer`}
        >
          <span
            className="text-themePurple text-lg font-medium"
            onClick={() => setFormType("company")}
          >
            Company
          </span>
        </div>
      </div>
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          {formState === "signup"
            ? formType === "job-seeker"
              ? "Get more opportunities"
              : "Company Signup"
            : formType === "job-seeker"
            ? "Job Seeker Login"
            : "Company Login"}
        </h1>

        <Button
          variant="outline"
          className="w-full mb-8 h-12 text-base font-normal"
          onClick={googleLogin}
        >
          <img
            src="/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          Sign {formState === "signup" ? "Up" : "In"} with Google
        </Button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or sign {formState === "signup" ? "up" : "in"} with email
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="flex justify-center text-red-500 text-sm mb-2">
            {errorMessage}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {formState === "signup" && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {formType === "company" ? "Company Name" : "Full Name"}
              </label>
              <Input
                id="name"
                placeholder={`Enter your ${
                  formType === "company" ? "company name" : "full name"
                }`}
                className="h-12"
                value={formValues.name || ""}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              className="h-12"
              value={formValues.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              className="h-12"
              value={formValues.password}
              onChange={handleInputChange}
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base">
            {formState === "signup" ? "Continue" : "Login"}
          </Button>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              {formState === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() =>
                  setFormState(formState === "signup" ? "login" : "signup")
                }
                className="text-primary font-medium"
              >
                {formState === "signup" ? "Login" : "Sign Up"}
              </button>
            </p>
            <p className="text-sm text-gray-500">
              By clicking &apos;Continue&apos;, you acknowledge that you have
              read and accept the{" "}
              <Link href="/terms" className="text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
