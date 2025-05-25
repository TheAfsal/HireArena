"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/slices/authSlice";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
const NavigationBar = () => {
  const [loadingState, setLoadingState] = useState(true);

  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setLoadingState(false);
    console.log(auth.token);
  }, [auth]);

  const handleLogout = () => {
    setLoadingState(true);
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-semibold">
              HireArena
            </Link>
            <div className="hidden md:flex gap-6">
              {auth.token && (
                <Link
                  href="/jobs"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Find Jobs
                </Link>
              )}
              {/* <a
                href="/companies"
                className="text-gray-600 hover:text-gray-900"
              >
                Browse Companies
              </a> */}
            </div>
          </div>
          <div className="flex gap-3">
            {loadingState ? (
              <div>Loading...</div>
            ) : auth.token ? (
              <Button onClick={handleLogout}>Log out</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push("/login")}>
                  Login
                </Button>
                <Button
                  className="bg-primary hover:bg-[#5558DD]"
                  onClick={() => router.push("/login")}
                >
                  Sign Up
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                theme != "light" ? setTheme("light") : setTheme("dark")
              }
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavigationBar;
