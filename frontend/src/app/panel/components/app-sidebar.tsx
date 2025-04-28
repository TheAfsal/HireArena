"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChevronRight,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  MessageCircleDashed,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavUser } from "./nav-user";

import {
  Calendar,
  MessageSquare,
  Users,
  Briefcase,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { verifyAuth } from "@/redux/slices/authSlice";

const data = {
  teams: [
    {
      name: "Hire Arena",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

const menuItems = [
  {
    title: "Dashboard",
    icon: Briefcase,
    url: "/panel",
    active: true,
  },
  {
    title: "All Applicants",
    icon: Users,
    url: "/panel/list-applications",
  },
  {
    title: "Job Listing",
    icon: Briefcase,
    url: "/panel/jobs-list",
  },
  {
    title: "My Schedule",
    icon: Calendar,
    url: "/panel/schedule",
  },
  {
    title: "Chats",
    icon: MessageCircleDashed,
    url: "/panel/chats",
  },
];

const settingsItems = [
  {
    title: "Settings",
    icon: Settings,
    url: "/panel/settings",
  },
  {
    title: "Help Center",
    icon: HelpCircle,
    url: "#",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const auth = useSelector((state: any) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  React.useEffect(() => {

    if (!auth.token) {
      router.push("/");
    } else if (!auth.isAuthenticated) {
      //@ts-ignore
      dispatch(verifyAuth());
    }
  }, [auth.token, auth.isAuthenticated, dispatch, router]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title}>
                  <a href={item.url} className="flex gap-2 items-center">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {settingsItems.map((item) => (
              <SidebarMenuItem
                key={item.title}
                className="peer-data-[active=true]/menu-button:opacity-100"
              >
                <SidebarMenuButton
                  asChild
                  className="peer-data-[active=true]/menu-button:opacity-100"
                >
                  <a href={item.url} >
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
