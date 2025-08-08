"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Shield, Bell, Eye, Settings, Clock, Save, Mail, Calendar } from "lucide-react"
import { useUser } from "@clerk/nextjs"

interface UserProfile {
  employeeId: string
  role: string
  department: string
  shift: string
  permissions: {
    view: boolean
    approve: boolean
    configure: boolean
    emergency: boolean
  }
  preferences: {
    notifications: boolean
    emailAlerts: boolean
    soundAlerts: boolean
    darkMode: boolean
    autoRefresh: boolean
    refreshInterval: number
  }
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    employeeId: "",
    role: "operator",
    department: "Production",
    shift: "Day Shift",
    permissions: {
      view: true,
      approve: false,
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
  })

  useEffect(() => {
    if (user) {
      // Generate employee ID based on user data or use metadata if available
      const employeeId = (user.unsafeMetadata?.employeeId as string) || 
                        `${user.firstName?.substring(0, 2) || 'US'}${user.id.substring(0, 3).toUpperCase()}`
      
      // Get role from user metadata or default
      const role = (user.unsafeMetadata?.role as string) || "operator"
      
      setProfile(prev => ({
        ...prev,
        employeeId,
        role,
        department: (user.unsafeMetadata?.department as string) || prev.department,
        shift: (user.unsafeMetadata?.shift as string) || prev.shift,
        permissions: (user.unsafeMetadata?.permissions as typeof prev.permissions) || prev.permissions,
        preferences: (user.unsafeMetadata?.preferences as typeof prev.preferences) || prev.preferences,
      }))
    }
  }, [user])

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

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || ""
    const last = lastName?.charAt(0) || ""
    return (first + last).toUpperCase() || "U"
  }

  const getFullName = () => {
    if (user?.fullName) return user.fullName
    return `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User"
  }

  const getPrimaryEmail = () => {
    return user?.emailAddresses?.[0]?.emailAddress || "No email"
  }

  const formatLastSignIn = () => {
    if (!user?.lastSignInAt) return "Never"
    return new Date(user.lastSignInAt).toLocaleString()
  }

  const handleSave = async () => {
    if (user) {
      try {
        // Update user metadata with profile information
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            employeeId: profile.employeeId,
            role: profile.role,
            department: profile.department,
            shift: profile.shift,
            permissions: profile.permissions,
            preferences: profile.preferences,
          }
        })
        setIsEditing(false)
      } catch (error) {
        console.error("Error updating profile:", error)
      }
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-900">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-700 px-4 bg-slate-900">
          <div className="flex-1 flex items-center">
            <h1 className="text-xl font-semibold text-white">Profile Settings</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-900">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-700 px-4 bg-slate-900">
          <div className="flex-1 flex items-center">
            <h1 className="text-xl font-semibold text-white">Profile Settings</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">User not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-700 px-4 bg-slate-900">
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-semibold text-white">Profile Settings</h1>
        </div>
        <div className="flex items-center space-x-4">
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
      </div>

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
                    <AvatarImage src={user.imageUrl} alt={getFullName()} />
                    <AvatarFallback className="bg-blue-500 text-white text-2xl">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">{getFullName()}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className={getRoleColor(profile.role)}>
                        {profile.role}
                      </Badge>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-slate-300">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={user.firstName || ""}
                        disabled
                        className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-50"
                      />
                      <p className="text-xs text-slate-500">Managed by Clerk</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-slate-300">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={user.lastName || ""}
                        disabled
                        className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-50"
                      />
                      <p className="text-xs text-slate-500">Managed by Clerk</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={getPrimaryEmail()}
                        disabled
                        className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-50"
                      />
                      <p className="text-xs text-slate-500">Managed by Clerk</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeId" className="text-slate-300">
                        Employee ID
                      </Label>
                      <Input
                        id="employeeId"
                        value={profile.employeeId}
                        onChange={(e) => setProfile({ ...profile, employeeId: e.target.value })}
                        disabled={!isEditing}
                        className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-slate-300">
                        Role
                      </Label>
                      <Select
                        value={profile.role}
                        onValueChange={(value) => setProfile({ ...profile, role: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="operator" className="text-white">
                            Operator
                          </SelectItem>
                          <SelectItem value="metallurgist" className="text-white">
                            Metallurgist
                          </SelectItem>
                          <SelectItem value="admin" className="text-white">
                            Administrator
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-slate-300">
                        Department
                      </Label>
                      <Select
                        value={profile.department}
                        onValueChange={(value) => setProfile({ ...profile, department: value })}
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
                        value={profile.shift}
                        onValueChange={(value) => setProfile({ ...profile, shift: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="Day Shift" className="text-white">
                            Day Shift (6 AM - 2 PM)
                          </SelectItem>
                          <SelectItem value="Evening Shift" className="text-white">
                            Evening Shift (2 PM - 10 PM)
                          </SelectItem>
                          <SelectItem value="Night Shift" className="text-white">
                            Night Shift (10 PM - 6 AM)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Last Sign In</Label>
                      <div className="flex items-center space-x-2 p-2 bg-slate-700/30 rounded border border-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-white text-sm">{formatLastSignIn()}</span>
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
                  <Bell className="w-5 h-5" />
                  <span>Preferences</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Customize your notification and display settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded border border-slate-600">
                      <div className="space-y-1">
                        <span className="text-white font-medium">Push Notifications</span>
                        <p className="text-sm text-slate-400">Receive alerts and updates</p>
                      </div>
                      <Switch
                        checked={profile.preferences.notifications}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, notifications: checked },
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded border border-slate-600">
                      <div className="space-y-1">
                        <span className="text-white font-medium">Email Alerts</span>
                        <p className="text-sm text-slate-400">Get important updates via email</p>
                      </div>
                      <Switch
                        checked={profile.preferences.emailAlerts}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, emailAlerts: checked },
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded border border-slate-600">
                      <div className="space-y-1">
                        <span className="text-white font-medium">Sound Alerts</span>
                        <p className="text-sm text-slate-400">Play sound for critical alerts</p>
                      </div>
                      <Switch
                        checked={profile.preferences.soundAlerts}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, soundAlerts: checked },
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded border border-slate-600">
                      <div className="space-y-1">
                        <span className="text-white font-medium">Auto Refresh</span>
                        <p className="text-sm text-slate-400">Automatically update data</p>
                      </div>
                      <Switch
                        checked={profile.preferences.autoRefresh}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, autoRefresh: checked },
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="refreshInterval" className="text-slate-300">
                        Refresh Interval (seconds)
                      </Label>
                      <Select
                        value={profile.preferences.refreshInterval.toString()}
                        onValueChange={(value) =>
                          setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, refreshInterval: parseInt(value) },
                          })
                        }
                        disabled={!isEditing || !profile.preferences.autoRefresh}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="15" className="text-white">
                            15 seconds
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Info Sidebar */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Account Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">User ID</span>
                  </div>
                  <p className="text-xs text-slate-500 break-all">{user.id}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">Account Created</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">Email Verified</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                    {user.emailAddresses?.[0]?.verification?.status === "verified" ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Permissions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(profile.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300 capitalize">{key}</span>
                      <Badge
                        variant="secondary"
                        className={
                          value
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }
                      >
                        {value ? "Granted" : "Denied"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}