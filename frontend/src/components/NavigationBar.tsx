"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/slices/authSlice";
import { Button } from "./ui/button";
const NavigationBar = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    setLoadingState(false);
    console.log(auth.token);
  }, [auth]);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-semibold">
              HireArena
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
                Find Jobs
              </Link>
              <a
                href="/companies"
                className="text-gray-600 hover:text-gray-900"
              >
                Browse Companies
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {loadingState ? (
              <div>Loading...</div>
            ) : auth.token ? (
              <Button onClick={() => dispatch(logout())}>Log out</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push("/login")}>
                  Login
                </Button>
                <Button
                  className="bg-[#6366F1] hover:bg-[#5558DD]"
                  onClick={() => router.push("/login")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavigationBar;
