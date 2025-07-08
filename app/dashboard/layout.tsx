import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-900">
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="flex-1">{children}</SidebarInset>
      </SidebarProvider>
    </div>
  )
}
