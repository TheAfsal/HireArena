"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Search,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  CrownIcon,
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
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const data = {
  teams: [
    {
      name: "Acme Inc",
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
    url: "#",
    active: true,
  },
  {
    title: "Messages",
    icon: MessageSquare,
    url: "#",
    badge: "1",
  },
  {
    title: "My Applications",
    icon: Users,
    url: "/job-seeker/my-applications",
  },
  {
    title: "Find Jobs",
    icon: Search,
    url: "/job-seeker/jobs",
  },
  {
    title: "Subscriptions",
    icon: CrownIcon,
    url: "/job-seeker/subscriptions",
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

  React.useEffect(() => {
    console.log(auth);

    if (!auth.token) {
      router.push("/");
    }
  }, [auth]);

  // React.useEffect(() => {
  //   if (auth.role != 'company') {
  //     router.push("/");
  //   }
  // }, [auth]);

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
        {/* <SidebarGroup className="group-data-[collapsible=icon]:hidden">
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
        </SidebarGroup> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
