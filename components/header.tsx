"use client"

import { Bell, LogOut, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  title?: string
  showNotifications?: boolean
  actions?: React.ReactNode
}

export function Header({ title = "Dashboard", showNotifications = true, actions }: HeaderProps) {
  const [notificationCount, setNotificationCount] = useState(3)
  const { user } = useUser()
  const { signOut } = useClerk()
  
  const clearNotifications = () => {
    setNotificationCount(0)
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-700 px-4 bg-slate-900">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white">{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center space-x-4">
        {actions}
        {showNotifications && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-slate-300" />
                {notificationCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white border-none"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-slate-800 border-slate-700">
              <div className="flex items-center justify-between p-2 border-b border-slate-700">
                <span className="font-medium text-white">Notifications</span>
                {notificationCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearNotifications}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              {notificationCount > 0 ? (
                <div className="py-2">
                  <DropdownMenuItem className="p-3 focus:bg-slate-700">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">Carbon Content Alert</span>
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Critical</Badge>
                      </div>
                      <p className="text-sm text-slate-400">Carbon level at 0.52%, target 0.40% ±0.05%</p>
                      <p className="text-xs text-slate-500 mt-1">5 min ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 focus:bg-slate-700">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">New AI Recommendation</span>
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">New</Badge>
                      </div>
                      <p className="text-sm text-slate-400">Optimization suggestions for Batch A2024-002</p>
                      <p className="text-xs text-slate-500 mt-1">10 min ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 focus:bg-slate-700">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">System Update</span>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Info</Badge>
                      </div>
                      <p className="text-sm text-slate-400">AI model updated to version 2.1.4</p>
                      <p className="text-xs text-slate-500 mt-1">1 hour ago</p>
                    </div>
                  </DropdownMenuItem>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-slate-400">No new notifications</p>
                </div>
              )}
              <div className="p-2 border-t border-slate-700">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 bg-transparent hover:bg-slate-700">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                <AvatarFallback className="bg-slate-700 text-white">
                  {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0) || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user?.fullName && (
                  <p className="font-medium text-white">{user.fullName}</p>
                )}
                {user?.emailAddresses[0]?.emailAddress && (
                  <p className="w-[200px] truncate text-sm text-slate-400">
                    {user.emailAddresses[0].emailAddress}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="focus:bg-slate-700" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-white">Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}