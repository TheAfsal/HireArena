"use client";
import React, { useEffect } from "react";
import AuthForm from "./components/AuthForm";
import HeaderCard from "./components/HeaderCard";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Page() {
  const auth = useSelector((state: any) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (auth.token) {
      router.push("/");
    }
  }, [auth]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="grid lg:grid-cols-2 gap-12 px-4 max-w-7xl mx-auto">
        <HeaderCard />
        <AuthForm />
      </main>
    </div>
  );
}
