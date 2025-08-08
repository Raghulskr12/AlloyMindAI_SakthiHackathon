"use client"

import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface HeaderProps {
  title?: string
  showNotifications?: boolean
  actions?: React.ReactNode
}

export function Header({ title = "Dashboard", showNotifications = true, actions }: HeaderProps) {
  const [notificationCount, setNotificationCount] = useState(3)
  
  const clearNotifications = () => {
    setNotificationCount(0)
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
      </div>
    </header>
  )
}