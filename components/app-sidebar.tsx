"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Zap,
  Monitor,
  Brain,
  History,
  AlertTriangle,
  Settings,
  Smartphone,
  TrendingUp,
  LogOut,
  User,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useUser, useClerk } from "@clerk/nextjs"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Monitor,
  },
  {
    title: "AI Recommendations",
    url: "/dashboard/ai-console",
    icon: Brain,
  },
  {
    title: "Decision History",
    url: "/dashboard/history",
    icon: History,
  },
  // {
  //   title: "Anomaly Center",
  //   url: "/dashboard/anomalies",
  //   icon: AlertTriangle,
  // },
  // {
  //   title: "Alerts",
  //   url: "/dashboard/mobile-alerts",
  //   icon: Smartphone,
  // },
  {
    title: "Model Performance",
    url: "/dashboard/performance",
    icon: TrendingUp,
  },
  {
    title: "Metallurgical Analytics",
    url: "/dashboard/metallurgical-analytics",
    icon: BarChart3,
  },
]

const configItems = [
  {
    title: "Alloy Specifications",
    url: "/dashboard/config/alloys",
    icon: Settings,
  },
  {
    title: "Profile Settings",
    url: "/dashboard/config/profile",
    icon: User,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || ""
    const last = lastName?.charAt(0) || ""
    return (first + last).toUpperCase() || "U"
  }

  const getFullName = () => {
    if (user?.fullName) return user.fullName
    return `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User"
  }

  const getUserRole = () => {
    return (user?.unsafeMetadata?.role as string) || "User"
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <Sidebar className="border-r border-slate-700 bg-slate-900">
      <SidebarHeader className="border-b border-slate-700">
        <div className="flex items-center space-x-2 px-2 py-2">
          <div>
            <h2 className="text-lg font-semibold text-white">AlloyMind AI</h2>
            <p className="text-xs text-slate-400">Metallurgy Control</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-900">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-700 bg-slate-900">
        <SidebarMenu>
          <SidebarMenuItem>
            {!isLoaded ? (
              <SidebarMenuButton className="text-slate-300">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-slate-700 text-white text-xs">...</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm">Loading...</span>
                  <span className="text-xs text-slate-400">Please wait</span>
                </div>
              </SidebarMenuButton>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-800">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user?.imageUrl} alt={getFullName()} />
                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                        {getInitials(user?.firstName, user?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm">{getFullName()}</span>
                      <span className="text-xs text-slate-400 capitalize">{getUserRole()}</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-56 bg-slate-800 border-slate-700">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/config/profile"
                      className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
