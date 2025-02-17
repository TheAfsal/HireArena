// components/Navbar.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/redux/slices/authSlice";

const Navbar = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    setLoadingState(false);
    if(!auth.token){
      router.push("/admin/login");
    }
  }, [auth]);

  const handleLogout = () => {
    dispatch(logoutAdmin());
  };

  return (
    <header className="flex border-b justify-between items-center h-16 p-10">
      <h1 className="text-xl font-semibold">
        <Link href="/" passHref>
          HireArena
        </Link>
      </h1>

      <div className="container flex justify-end items-center px-4 w-full gap-5">
        <nav className="hidden md:block">
          <ul className="flex gap-6">
            <li>
              <Link href="/admin" className="text-sm font-medium text-primary">
                Overview
              </Link>
            </li>
            <li>
              <Link
                href="/admin/jobs"
                className="text-sm font-medium text-muted-foreground"
              >
                Jobs
              </Link>
            </li>
            <li>
              <Link
                href="/admin/companies"
                className="text-sm font-medium text-muted-foreground"
              >
                Companies
              </Link>
            </li>
            <li>
              <Link
                href="/admin/candidates"
                className="text-sm font-medium text-muted-foreground"
              >
                Candidates
              </Link>
            </li>
            <li>
              <Link
                href="/admin/manage"
                className="text-sm font-medium text-muted-foreground"
              >
                Manage
              </Link>
            </li>
            <li>
              <Link
                href="/admin/reports"
                className="text-sm font-medium text-muted-foreground"
              >
                Reports
              </Link>
            </li>
          </ul>
        </nav>

        {/* Notification Bell Button */}
        <div className="flex gap-3">
          <div className="flex items-center gap-4">
            {loadingState ? (
              <div>Loading...</div>
            ) : auth.token ? (
              <Button className="rounded-xl" onClick={handleLogout}>
                Log out
              </Button>
            ) : (
              <></>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="bg-slate-100 rounded-xl"
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
