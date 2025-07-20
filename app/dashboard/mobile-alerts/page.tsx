"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { AlertTriangle, CheckCircle, Clock, Smartphone, Bell, Shield, Zap, Settings } from "lucide-react"

const mobileAlerts = [
  {
    id: "MA-001",
    priority: "critical",
    title: "Emergency: Furnace Temperature Critical",
    message: "Temperature exceeded 1800°C. Immediate action required.",
    timestamp: "2 min ago",
    batchId: "A2024-001",
    acknowledged: false,
    canOverride: true,
  },
  {
    id: "MA-002",
    priority: "high",
    title: "Carbon Content Out of Range",
    message: "Carbon level at 0.52%, target 0.40% ±0.05%",
    timestamp: "5 min ago",
    batchId: "A2024-001",
    acknowledged: false,
    canOverride: false,
  },
  {
    id: "MA-003",
    priority: "medium",
    title: "AI Recommendation Available",
    message: "New optimization suggestions for Batch A2024-002",
    timestamp: "8 min ago",
    batchId: "A2024-002",
    acknowledged: true,
    canOverride: false,
  },
  {
    id: "MA-004",
    priority: "low",
    title: "Scheduled Maintenance Reminder",
    message: "Spectrometer calibration due in 2 hours",
    timestamp: "15 min ago",
    batchId: null,
    acknowledged: false,
    canOverride: false,
  },
  {
    id: "MA-005",
    priority: "high",
    title: "Manganese Addition Required",
    message: "Mn level below target. Add 2.5kg Ferro-Manganese",
    timestamp: "18 min ago",
    batchId: "A2024-001",
    acknowledged: true,
    canOverride: false,
  },
]

const notificationSettings = [
  { type: "Critical Alerts", enabled: true, sound: true, vibration: true },
  { type: "High Priority", enabled: true, sound: true, vibration: false },
  { type: "Medium Priority", enabled: true, sound: false, vibration: false },
  { type: "Low Priority", enabled: false, sound: false, vibration: false },
]

export default function MobileAlertsPage() {
  const [alerts, setAlerts] = useState(mobileAlerts)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-400" />
      case "high":
        return <AlertTriangle className="w-5 h-5 text-orange-400" />
      case "medium":
        return <Bell className="w-5 h-5 text-yellow-400" />
      case "low":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      default:
        return <Bell className="w-5 h-5 text-slate-400" />
    }
  }

  const handleAcknowledge = (alertId: string) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const handleOverride = (alertId: string) => {
    // Handle critical override logic
    console.log(`Override requested for alert: ${alertId}`)
  }

  const unacknowledgedCount = alerts.filter((alert) => !alert.acknowledged).length
  const criticalCount = alerts.filter((alert) => alert.priority === "critical" && !alert.acknowledged).length

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Mobile Alert Console</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center space-x-2">
          <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">
            {criticalCount} Critical
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            {unacknowledgedCount} Unread
          </Badge>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Mobile Interface Preview */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Alert Summary */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Smartphone className="w-5 h-5" />
                  <span>Priority Alert Queue</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Mobile-optimized notifications sorted by priority
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
                    <div className="text-xs text-red-400">Critical</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <div className="text-2xl font-bold text-orange-400">
                      {alerts.filter((a) => a.priority === "high" && !a.acknowledged).length}
                    </div>
                    <div className="text-xs text-orange-400">High</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="text-2xl font-bold text-yellow-400">
                      {alerts.filter((a) => a.priority === "medium" && !a.acknowledged).length}
                    </div>
                    <div className="text-xs text-yellow-400">Medium</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400">
                      {alerts.filter((a) => a.priority === "low" && !a.acknowledged).length}
                    </div>
                    <div className="text-xs text-green-400">Low</div>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-4">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Acknowledge All Non-Critical
                </Button>
              </CardContent>
            </Card>

            {/* Alert List */}
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`bg-slate-800/50 border-slate-700 ${!alert.acknowledged ? "ring-1 ring-blue-500/20" : ""}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        {getPriorityIcon(alert.priority)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-white font-medium">{alert.title}</h3>
                            <Badge variant="secondary" className={getPriorityColor(alert.priority)}>
                              {alert.priority}
                            </Badge>
                            {!alert.acknowledged && (
                              <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{alert.message}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-400">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{alert.timestamp}</span>
                            </span>
                            {alert.batchId && <span>Batch: {alert.batchId}</span>}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!alert.acknowledged && (
                        <Button
                          size="sm"
                          onClick={() => handleAcknowledge(alert.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Acknowledge
                        </Button>
                      )}
                      {alert.canOverride && alert.priority === "critical" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleOverride(alert.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Critical Override
                        </Button>
                      )}
                      {alert.acknowledged && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Acknowledged
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mobile Settings & Controls */}
          <div className="space-y-6">
            {/* Notification Settings */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Notification Settings</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Configure mobile alert preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notificationSettings.map((setting) => (
                  <div key={setting.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">{setting.type}</span>
                      <Badge
                        variant="secondary"
                        className={
                          setting.enabled
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }
                      >
                        {setting.enabled ? "ON" : "OFF"}
                      </Badge>
                    </div>
                    {setting.enabled && (
                      <div className="flex items-center space-x-4 text-xs text-slate-400 ml-4">
                        <span className={setting.sound ? "text-green-400" : "text-slate-500"}>🔊 Sound</span>
                        <span className={setting.vibration ? "text-green-400" : "text-slate-500"}>📳 Vibration</span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Emergency Stop
                </Button>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Priority Override
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 bg-transparent">
                  <Bell className="w-4 h-4 mr-2" />
                  Test Notifications
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Alerts
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}


           

          
               
               

            
          </div>
        </div>
      </div>
    </>
  )
}
