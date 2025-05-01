"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { LoginCompany, LoginJobSeeker, SignupCompany, SignupJobSeeker } from "@/app/api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/store"
import { useRouter } from "next/navigation"
import { loginFailure, loginSuccess } from "@/redux/slices/authSlice"
import EmailPopup from "./EmailPopUp"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

type FormType = "job-seeker" | "company"
type FormState = "login" | "signup"

interface FormValues {
  email: string
  password: string
  name?: string
  companyName?: string
}

function AuthForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const [formType, setFormType] = useState<FormType>("job-seeker")
  const [formState, setFormState] = useState<FormState>("login")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [popupForgotPassword, setPopupForgotPassword] = useState<boolean>(false)
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
    name: "",
  })

  useEffect(() => {
    if (formType === "job-seeker" && formState === "login")
      setFormValues({
        email: "afsal@gmail.com",
        password: "123123",
        name: "",
      })
    else if (formType === "company" && formState === "login")
      setFormValues({
        email: "alexander@gmail.com",
        password: "123123",
        name: "",
      })
    else
      setFormValues({
        email: "",
        password: "",
        name: "",
      })
  }, [formType, formState])

  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target
    setFormValues((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    // Basic validation before submitting the form
    const errors: string[] = []

    if (!formValues.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      setLoading(false)
      errors.push("Please enter a valid email address.")
    }

    if (!formValues.password || formValues.password.length < 6) {
      setLoading(false)
      errors.push("Password must be at least 6 characters long.")
    }

    if (formState === "signup" && !formValues.name?.trim()) {
      setLoading(false)
      errors.push("Name is required.")
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(" "))
      return
    }

    if (formState === "login") {
      if (formType === "job-seeker") {
        const response = await LoginJobSeeker(formValues)
        if (response.status === "success") {
          const { accessToken } = response.data!.tokens
          const { user } = response.data!

          if (accessToken) {
            localStorage.setItem("authToken", accessToken)
            dispatch(loginSuccess({ user, token: accessToken, role: formType }))
          }
          setTimeout(() => {
            router.push("/job-seeker")
          }, 0)
        } else {
          const errorMessage =
            typeof response === "string"
              ? "Login failed"
              : //@ts-ignore
                response?.error?.error || "Login failed"
          setErrorMessage(errorMessage)
          dispatch(loginFailure(errorMessage))
          setLoading(false)
        }
      } else {
        const response = await LoginCompany(formValues)

        if (response.status === "success") {
          const { accessToken } = response.data!.tokens
          const { user } = response.data!

          if (accessToken) {
            localStorage.setItem("authToken", accessToken)
            dispatch(loginSuccess({ user, token: accessToken, role: formType }))
          }
          setTimeout(() => {
            router.push("/panel")
          }, 0)
        } else {
          const errorMessage =
            typeof response === "string"
              ? "Login failed"
              : //@ts-ignore
                response?.error.error || "Login failed"
          setErrorMessage(errorMessage)
          dispatch(loginFailure(errorMessage))
          setLoading(false)
        }
      }
    } else if (formState === "signup") {
      let response

      if (formType === "job-seeker") {
        response = await SignupJobSeeker(formValues)
        setLoading(false)
        if (response.status === "success") {
          toast({
            title: "Success",
            //@ts-ignore
            description: response.message,
          })
        } else {
          const errorMessage = typeof response === "string" ? "Signup failed" : response?.error || "Signup failed"
          //@ts-ignore
          setErrorMessage(errorMessage.error)
          dispatch(loginFailure(errorMessage))
        }
      } else {
        response = await SignupCompany(formValues)
        setLoading(false)
        if (response.status === "success") {
          toast({
            title: "Success",
            //@ts-ignore
            description: response.message,
          })
        } else {
          const errorMessage =
            typeof response === "string"
              ? "Signup failed"
              : //@ts-ignore
                response?.error?.error || "Signup failed"
          setErrorMessage(errorMessage)
          dispatch(loginFailure(errorMessage))
        }
      }
    } else {
      setErrorMessage("Something went wrong")
    }
  }

  const closePopup = () => {
    setPopupForgotPassword(false)
  }

  const googleLogin = () => {
    window.open("http://localhost:4000/user-service/auth/api/auth/google", "_self")
    // window.open("http://localhost:5000/auth/google", "_self")
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Processing your request...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-neutral-200 dark:border-neutral-800"
    >
      <div className="flex items-center justify-center gap-6 p-4 mb-4">
        <div
          className={`${
            formType === "job-seeker" ? "bg-primary/10 border-primary" : "border-transparent"
          } px-6 py-3 rounded-full cursor-pointer border-2 transition-all duration-300`}
        >
          <span
            className={`${
              formType === "job-seeker" ? "text-primary" : "text-gray-600 dark:text-gray-400"
            } text-lg font-medium`}
            onClick={() => setFormType("job-seeker")}
          >
            Job Seeker
          </span>
        </div>
        <div
          className={`${
            formType === "company" ? "bg-primary/10 border-primary" : "border-transparent"
          } px-6 py-3 rounded-full cursor-pointer border-2 transition-all duration-300`}
        >
          <span
            className={`${
              formType === "company" ? "text-primary" : "text-gray-600 dark:text-gray-400"
            } text-lg font-medium`}
            onClick={() => setFormType("company")}
          >
            Company
          </span>
        </div>
      </div>
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
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
          className="w-full mb-8 h-12 text-base font-normal border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
          onClick={googleLogin}
        >
          <img src="/google.svg" alt="Google" width={20} height={20} className="mr-2" />
          Sign {formState === "signup" ? "Up" : "In"} with Google
        </Button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-neutral-900 text-gray-500 dark:text-gray-400">
              Or sign {formState === "signup" ? "up" : "in"} with email
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="flex justify-center text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {formState === "signup" && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {formType === "company" ? "Company Name" : "Full Name"}
              </label>
              <Input
                id="name"
                placeholder={`Enter your ${formType === "company" ? "company name" : "full name"}`}
                className="h-12 bg-white dark:bg-neutral-800 border-gray-300 dark:border-gray-700"
                value={formValues.name || ""}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              className="h-12 bg-white dark:bg-neutral-800 border-gray-300 dark:border-gray-700"
              value={formValues.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              className="h-12 bg-white dark:bg-neutral-800 border-gray-300 dark:border-gray-700"
              value={formValues.password}
              onChange={handleInputChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base bg-primary hover:bg-primary/90 transition-all duration-300"
          >
            {formState === "signup" ? "Continue" : "Login"}
          </Button>

          {formState === "login" && (
            <p className="flex justify-center text-sm text-gray-600 dark:text-gray-400">
              <button
                type="button"
                onClick={() => setPopupForgotPassword(true)}
                className="text-primary font-medium hover:underline"
              >
                Forgot password?
              </button>
            </p>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {formState === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setFormState(formState === "signup" ? "login" : "signup")}
                className="text-primary font-medium hover:underline"
              >
                {formState === "signup" ? "Login" : "Sign Up"}
              </button>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              By clicking &apos;Continue&apos;, you acknowledge that you have read and accept the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </form>
        {popupForgotPassword && <EmailPopup onClose={closePopup} />}
      </div>
    </motion.div>
  )
}

export default AuthForm
