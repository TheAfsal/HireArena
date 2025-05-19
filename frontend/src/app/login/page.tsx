"use client";

import { useEffect } from "react";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import BackgroundPaths from "./components/BackgroundPaths";

export default function Page() {
  const auth = useSelector((state: any) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (auth.token) {
      router.push("/");
    }
  }, [auth]);

  return (
    <div className="h-screen relative bg-white dark:bg-neutral-950">
      <Navbar />
      <BackgroundPaths title="HireArena" />
      <div className="relative z-10 pt-16 pb-24">
        <main className="grid lg:grid-cols-2 mt-10 px-4 max-w-7xl mx-auto">
          <div /> 
          <AuthForm /> 
        </main>
      </div>
    </div>
  );
}
