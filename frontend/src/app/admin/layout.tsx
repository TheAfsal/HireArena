import "@/app/globals.css";
import { Inter } from "next/font/google";
import type React from "react";
import NavBar from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HireArena Dashboard",
  description: "Recruitment pipeline and metrics dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
}
