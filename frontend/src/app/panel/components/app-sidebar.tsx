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
// import { NavMain } from "./nav-main";
// import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";

import {
  Calendar,
  MessageSquare,
  Users,
  Briefcase,
  Settings,
  HelpCircle,
} from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/invitationBanner.jpg",
  },
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
    title: "All Applicants",
    icon: Users,
    url: "#",
  },
  {
    title: "Job Listing",
    icon: Briefcase,
    url: "#",
  },
  {
    title: "My Schedule",
    icon: Calendar,
    url: "#",
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
                    <SidebarMenuButton tooltip={item.title} >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {settingsItems.map((item) => (
          <SidebarMenuItem key={item.title} className="peer-data-[active=true]/menu-button:opacity-100">
            <SidebarMenuButton asChild className="peer-data-[active=true]/menu-button:opacity-100">
              <a href={item.url}>
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// import {
//   Calendar,
//   MessageSquare,
//   Users,
//   Briefcase,
//   Settings,
//   HelpCircle,
//   ChevronUp,
//   Plus,
// } from "lucide-react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuAction,
//   SidebarMenuBadge,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarRail,
// } from "@/components/ui/sidebar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

// const menuItems = [
//   {
//     title: "Dashboard",
//     icon: Briefcase,
//     url: "#",
//     active: true,
//   },
//   {
//     title: "Messages",
//     icon: MessageSquare,
//     url: "#",
//     badge: "1",
//   },
//   {
//     title: "All Applicants",
//     icon: Users,
//     url: "#",
//   },
//   {
//     title: "Job Listing",
//     icon: Briefcase,
//     url: "#",
//   },
//   {
//     title: "My Schedule",
//     icon: Calendar,
//     url: "#",
//   },
// ];

// const settingsItems = [
//   {
//     title: "Settings",
//     icon: Settings,
//     url: "#",
//   },
//   {
//     title: "Help Center",
//     icon: HelpCircle,
//     url: "#",
//   },
// ];

// export function AppSidebar() {
//   return (
//     <Sidebar className="bg-white border-r" collapsible="icon">
//       <div className="p-4 border-b">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
//           <span className="font-semibold text-xl">HireArena</span>
//         </div>
//       </div>

//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {menuItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton
//                     asChild
//                     className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg
//                       ${
//                         item.active
//                           ? "bg-indigo-50 text-indigo-600"
//                           : "text-gray-700 hover:bg-gray-50"
//                       }`}
//                   >
//                     <a href={item.url} className="flex items-center w-full">
//                       <item.icon className="w-5 h-5" />
//                       <span className="ml-3">{item.title}</span>
//                       {item.badge && (
//                         <span className="ml-auto bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
//                           {item.badge}
//                         </span>
//                       )}
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarGroup className="mt-8">
//           <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-400 mb-2">
//             SETTINGS
//           </SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {settingsItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton
//                     asChild
//                     className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
//                   >
//                     <a href={item.url} className="flex items-center">
//                       <item.icon className="w-5 h-5" />
//                       <span className="ml-3">{item.title}</span>
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       <SidebarFooter className="border-t">
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <SidebarMenuButton className="w-full p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-gray-200"></div>
//                     <div className="flex-1 text-left">
//                       <div className="font-medium">Maria Kelly</div>
//                       <div className="text-sm text-gray-500">
//                         Maria@liveemail.com
//                       </div>
//                     </div>
//                     <ChevronUp className="w-5 h-5" />
//                   </div>
//                 </SidebarMenuButton>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 side="top"
//                 className="w-[--radix-popper-anchor-width]"
//               >
//                 <DropdownMenuItem>
//                   <span>Account Settings</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <span>Profile</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <span>Sign out</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//     </Sidebar>
//   );
// }

// export default AppSidebar;
