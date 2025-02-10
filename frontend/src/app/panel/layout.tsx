import { cookies } from "next/headers";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "./components/navbar";
import { useSelector } from "react-redux";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}