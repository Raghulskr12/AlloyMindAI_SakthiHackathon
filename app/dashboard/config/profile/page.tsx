"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { User, Shield, Bell, Eye, Settings, Clock, Save } from "lucide-react"

const currentUser = {
  id: "USR-001",
  name: "Sakthi ",
  email: "Sakthi@alloymind.com",
  employeeId: "MT001",
  role: "metallurgist",
  department: "Production",
  shift: "Day Shift",
  status: "active",
  lastLogin: "2024-01-15 14:30",
  permissions: {
    view: true,
    approve: true,
    configure: false,
    emergency: false,
  },
  preferences: {
    notifications: true,
    emailAlerts: true,
    soundAlerts: false,
    darkMode: true,
    autoRefresh: true,
    refreshInterval: 30,
  },
}

export default function ProfilePage() {
  const [user, setUser] = useState(currentUser)
  const [isEditing, setIsEditing] = useState(false)

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "metallurgist":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "operator":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleSave = () => {
    setIsEditing(false)
    // Save logic would go here
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-700 px-4 bg-slate-900">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Profile Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your account details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-blue-500 text-white text-2xl">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        disabled={!isEditing}
                        className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        disabled={!isEditing}
                        className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeId" className="text-slate-300">
                        Employee ID
                      </Label>
                      <Input
                        id="employeeId"
                        value={user.employeeId}
                        disabled
                        className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-slate-300">
                        Department
                      </Label>
                      <Select
                        value={user.department}
                        onValueChange={(value) => setUser({ ...user, department: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="Production" className="text-white">
                            Production
                          </SelectItem>
                          <SelectItem value="Quality Control" className="text-white">
                            Quality Control
                          </SelectItem>
                          <SelectItem value="IT" className="text-white">
                            IT
                          </SelectItem>
                          <SelectItem value="Management" className="text-white">
                            Management
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shift" className="text-slate-300">
                        Shift Assignment
                      </Label>
                      <Select
                        value={user.shift}
                        onValueChange={(value) => setUser({ ...user, shift: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="Day Shift" className="text-white">
                            Day Shift (6AM - 6PM)
                          </SelectItem>
                          <SelectItem value="Night Shift" className="text-white">
                            Night Shift (6PM - 6AM)
                          </SelectItem>
                          <SelectItem value="Rotating" className="text-white">
                            Rotating Shift
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Last Login</Label>
                      <div className="flex items-center space-x-2 text-white">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{user.lastLogin}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Preferences</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Customize your dashboard and notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-slate-400" />
                          <span className="text-white">Push Notifications</span>
                        </div>
                        <Switch
                          checked={user.preferences.notifications}
                          onCheckedChange={(checked) =>
                            setUser({
                              ...user,
                              preferences: { ...user.preferences, notifications: checked },
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-slate-400" />
                          <span className="text-white">Email Alerts</span>
                        </div>
                        <Switch
                          checked={user.preferences.emailAlerts}
                          onCheckedChange={(checked) =>
                            setUser({
                              ...user,
                              preferences: { ...user.preferences, emailAlerts: checked },
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-slate-400" />
                          <span className="text-white">Sound Alerts</span>
                        </div>
                        <Switch
                          checked={user.preferences.soundAlerts}
                          onCheckedChange={(checked) =>
                            setUser({
                              ...user,
                              preferences: { ...user.preferences, soundAlerts: checked },
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Display</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-slate-400" />
                          <span className="text-white">Dark Mode</span>
                        </div>
                        <Switch
                          checked={user.preferences.darkMode}
                          onCheckedChange={(checked) =>
                            setUser({
                              ...user,
                              preferences: { ...user.preferences, darkMode: checked },
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-white">Auto Refresh</span>
                        </div>
                        <Switch
                          checked={user.preferences.autoRefresh}
                          onCheckedChange={(checked) =>
                            setUser({
                              ...user,
                              preferences: { ...user.preferences, autoRefresh: checked },
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      {user.preferences.autoRefresh && (
                        <div className="space-y-2">
                          <Label htmlFor="refreshInterval" className="text-slate-300">
                            Refresh Interval (seconds)
                          </Label>
                          <Select
                            value={user.preferences.refreshInterval.toString()}
                            onValueChange={(value) =>
                              setUser({
                                ...user,
                                preferences: { ...user.preferences, refreshInterval: Number.parseInt(value) },
                              })
                            }
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="10" className="text-white">
                                10 seconds
                              </SelectItem>
                              <SelectItem value="30" className="text-white">
                                30 seconds
                              </SelectItem>
                              <SelectItem value="60" className="text-white">
                                1 minute
                              </SelectItem>
                              <SelectItem value="300" className="text-white">
                                5 minutes
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Permissions & Security */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Permissions</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Your current access level and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-slate-400" />
                      <span className="text-white">View Dashboard</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        user.permissions.view
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }
                    >
                      {user.permissions.view ? "Granted" : "Denied"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span className="text-white">Approve Recommendations</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        user.permissions.approve
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }
                    >
                      {user.permissions.approve ? "Granted" : "Denied"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span className="text-white">Configure System</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        user.permissions.configure
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }
                    >
                      {user.permissions.configure ? "Granted" : "Denied"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-red-400" />
                      <span className="text-white">Emergency Override</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        user.permissions.emergency
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }
                    >
                      {user.permissions.emergency ? "Granted" : "Denied"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Account Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 bg-transparent">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 bg-transparent">
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 bg-transparent">
                  Download Activity Log
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
