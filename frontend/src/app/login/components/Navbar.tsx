"use client";

import React from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

// Navbar Component
function Navbar() {
  return (
    <header className="flex items-center justify-between p-4 max-w-7xl mx-auto border-b">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-semibold">HireArena</span>
      </Link>
    </header>
  );
}

export default Navbar;
