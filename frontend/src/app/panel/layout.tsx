import { cookies } from "next/headers";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "./components/navbar";

export const metadata = {
  title: "Hire Arena",
  description: "Your page description",
  icons: {
    icon: "/logo.png", 
  },
};

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