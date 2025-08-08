"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { AlertTriangle, CheckCircle, Clock, TrendingDown, Brain, Settings, Activity } from "lucide-react"

const initialAnomalies = [
  {
    id: "ANO-001",
    type: "Spectrometer Drift",
    severity: "high",
    timestamp: "2024-01-15 14:30:22",
    description: "Carbon readings showing consistent +0.02% bias over last 6 measurements",
    status: "active",
    rootCause: "Sensor",
    impact: "Measurement accuracy compromised",
    recommendation: "Recalibrate spectrometer with certified reference materials",
    batchesAffected: 3,
  },
  {
    id: "ANO-002",
    type: "Unusual Correction Pattern",
    severity: "medium",
    timestamp: "2024-01-15 16:45:10",
    description: "Manganese additions 40% higher than historical average for AISI 4140",
    status: "investigating",
    rootCause: "Process",
    impact: "Increased material costs",
    recommendation: "Review furnace temperature profile and raw material quality",
    batchesAffected: 5,
  },
  {
    id: "ANO-003",
    type: "Model Confidence Drop",
    severity: "low",
    timestamp: "2024-01-16 09:15:33",
    description: "AI model confidence below 85% for silicon predictions",
    status: "resolved",
    rootCause: "AI",
    impact: "Reduced prediction reliability",
    recommendation: "Retrain model with recent data patterns",
    batchesAffected: 2,
  },
  {
    id: "ANO-004",
    type: "Temperature Fluctuation",
    severity: "high",
    timestamp: "2024-01-16 11:22:15",
    description: "Furnace temperature varying ±25°C from setpoint",
    status: "active",
    rootCause: "Sensor",
    impact: "Inconsistent melt quality",
    recommendation: "Check thermocouple integrity and control system",
    batchesAffected: 1,
  },
]

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState(initialAnomalies)
  const [filterSeverity, setFilterSeverity] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterRootCause, setFilterRootCause] = useState("")

  // Filtered anomalies for display
  const filteredAnomalies = anomalies.filter((anomaly) => {
    return (
      (!filterSeverity || anomaly.severity === filterSeverity) &&
      (!filterStatus || anomaly.status === filterStatus) &&
      (!filterRootCause || anomaly.rootCause === filterRootCause)
    );
  });

  // Stats for dashboard cards
  const stats = {
    active: anomalies.filter((a) => a.status === "active").length,
    investigating: anomalies.filter((a) => a.status === "investigating").length,
    resolved: anomalies.filter((a) => a.status === "resolved").length,
    totalBatches: anomalies.reduce((sum, a) => sum + (a.batchesAffected || 0), 0),
  };

  // Root cause stats for sidebar
  const rootCauseTypes = ["Sensor", "Process", "AI", "Equipment"];
  const rootCauseStats = rootCauseTypes.map((type) => {
    const count = anomalies.filter((a) => a.rootCause === type).length;
    const percentage = anomalies.length ? Math.round((count / anomalies.length) * 100) : 0;
    return { type, count, percentage };
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "investigating":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "resolved":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getRootCauseIcon = (rootCause: string) => {
    switch (rootCause) {
      case "Sensor":
        return <Activity className="w-4 h-4" />
      case "Process":
        return <Settings className="w-4 h-4" />
      case "AI":
        return <Brain className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  return (
    <>


        <div className="flex-1 space-y-6 p-6">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-red-400">{stats.active}</p>
                    <p className="text-sm text-slate-400">Active Alerts</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-yellow-400">{stats.investigating}</p>
                    <p className="text-sm text-slate-400">Investigating</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
                    <p className="text-sm text-slate-400">Resolved Today</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-400">{stats.totalBatches}</p>
                    <p className="text-sm text-slate-400">Batches Affected</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Anomaly List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Filter Anomalies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="high" className="text-white">
                        High
                      </SelectItem>
                      <SelectItem value="medium" className="text-white">
                        Medium
                      </SelectItem>
                      <SelectItem value="low" className="text-white">
                        Low
                      </SelectItem>
                    </SelectContent>
                  </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="active" className="text-white">Active</SelectItem>
                        <SelectItem value="investigating" className="text-white">Investigating</SelectItem>
                        <SelectItem value="resolved" className="text-white">Resolved</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterRootCause} onValueChange={setFilterRootCause}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Root Cause" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="Sensor" className="text-white">Sensor</SelectItem>
                        <SelectItem value="Process" className="text-white">Process</SelectItem>
                        <SelectItem value="AI" className="text-white">AI</SelectItem>
                        <SelectItem value="Equipment" className="text-white">Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(filterSeverity || filterStatus || filterRootCause) && (
                    <p className="text-sm text-slate-400 mt-2">
                      Showing {filteredAnomalies.length} of {anomalies.length} anomalies
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Anomaly Cards */}
              <div className="space-y-4">
                {filteredAnomalies.map((anomaly: typeof initialAnomalies[0]) => (
                  <Card key={anomaly.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getRootCauseIcon(anomaly.rootCause)}
                          <div>
                            <CardTitle className="text-white text-lg">{anomaly.type}</CardTitle>
                            <CardDescription className="text-slate-400">
                              {anomaly.id} • {anomaly.timestamp}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className={getSeverityColor(anomaly.severity)}>
                            {anomaly.severity}
                          </Badge>
                          <Badge variant="secondary" className={getStatusColor(anomaly.status)}>
                            {anomaly.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-300">{anomaly.description}</p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Root Cause:</span>
                            <span className="text-white">{anomaly.rootCause}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Batches Affected:</span>
                            <span className="text-white">{anomaly.batchesAffected}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-slate-400">Impact:</span>
                            <p className="text-white mt-1">{anomaly.impact}</p>
                          </div>
                        </div>
                      </div>

                      <Alert className="bg-blue-500/10 border-blue-500/20">
                        <AlertDescription className="text-blue-400">
                          <strong>Recommendation:</strong> {anomaly.recommendation}
                        </AlertDescription>
                      </Alert>

                    <div className="flex items-center space-x-2">
                      {anomaly.status === "active" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Acknowledge
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 bg-transparent"
                          >
                            Investigate
                          </Button>
                        </>
                      )}
                      {anomaly.status === "investigating" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 bg-transparent"
                          >
                            Update Status
                          </Button>
                        </>
                      )}
                      {anomaly.status === "resolved" && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Root Cause Analysis */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Root Cause Analysis</CardTitle>
                  <CardDescription className="text-slate-400">Current anomalies breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {rootCauseStats.map((stat: { type: string; count: number; percentage: number }) => (
                    <div key={stat.type} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">{stat.type}</span>
                        <span className="text-white">
                          {stat.count} ({stat.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Settings className="w-4 h-4 mr-2" />
                  System Diagnostics
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 bg-transparent">
                  <Activity className="w-4 h-4 mr-2" />
                  Sensor Calibration
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 bg-transparent">
                  <Brain className="w-4 h-4 mr-2" />
                  Model Retraining
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
