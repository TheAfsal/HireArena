"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { VerifyUserEmail } from "@/app/api/auth";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { loginSuccess } from "@/redux/slices/authSlice";
import React from "react";

export default function VerifyEmail() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const token = params.token;

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        let response = await VerifyUserEmail(token as string);
        if (response.status === "success") {
          const accessToken = response.accessToken;
          const user = response.data!;
          console.log(accessToken);

          if (accessToken!=='null') {
            localStorage.setItem("authToken", accessToken);
            dispatch(
              loginSuccess({ user, token: accessToken, role: response.role })
            );
          }
          setStatus("success");
        }
      } catch (error: unknown) {
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="py-40 flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6 text-center">
        {status === "loading" && (
          <div className="py-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <h1 className="text-2xl font-semibold">Verifying your email...</h1>
            <p className="text-gray-500">
              Please wait while we verify your email address.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="py-8 space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h1 className="text-2xl font-semibold text-green-500">
              Email Verified!
            </h1>
            <p className="text-gray-500">
              Your email has been successfully verified. You can now access all
              features of HireArena.
            </p>
            <div className="pt-4">
              <Link href="/">
                <Button className="w-full">Go to Homepage</Button>
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="py-8 space-y-4">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h1 className="text-2xl font-semibold text-red-500">
              Verification Failed
            </h1>
            <p className="text-gray-500">
              We couldn&apos;t verify your email address. The verification link
              may be expired or invalid.
            </p>
            <div className="pt-4 space-y-2">
              <Link href="/auth/resend-verification">
                <Button variant="outline" className="w-full">
                  Resend Verification Email
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full">Return to Homepage</Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
