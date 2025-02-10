// components/Navbar.tsx
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Link from "next/link";
import React from "react";

const Navbar = () => {
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
                href="/admin/reports"
                className="text-sm font-medium text-muted-foreground"
              >
                Reports
              </Link>
            </li>
          </ul>
        </nav>

        {/* Notification Bell Button */}
        <Button size="icon" variant="ghost" className="bg-slate-100 rounded-xl">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
