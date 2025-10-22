import * as React from "react"
import {
  AudioWaveform,
  Bell,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  Package,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"
import path from "path"

const data = {
  user: {
    name: "EVM",
    email: "valdir@evm.com",
    avatar: "src/assets/images/evm.png",
  },
  teams: [
    {
      name: "Armazyn",
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
      title: "Dashboard",
      url: "/",
      icon: PieChart,
      isActive: true,
      
    },
    {
      title: "Produtos",
      url: "/produtos",
      icon: Package,
    },
    {
      title: "Alertas",
      url: "#",
      icon: Bell,
     
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
      
    },
  ],
  
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
