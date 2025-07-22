"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import {
  Thermometer,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  StopCircle,
} from "lucide-react"
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';

// Mock data for periodic table elements
const elements = [
  { symbol: "Fe", name: "Iron", current: 85.2, target: 85.0, tolerance: 1.0, trend: "stable" },
  { symbol: "C", name: "Carbon", current: 0.45, target: 0.4, tolerance: 0.05, trend: "up" },
  { symbol: "Mn", name: "Manganese", current: 1.2, target: 1.3, tolerance: 0.1, trend: "down" },
  { symbol: "Si", name: "Silicon", current: 0.25, target: 0.3, tolerance: 0.05, trend: "stable" },
  { symbol: "P", name: "Phosphorus", current: 0.025, target: 0.03, tolerance: 0.005, trend: "up" },
  { symbol: "S", name: "Sulfur", current: 0.015, target: 0.02, tolerance: 0.005, trend: "stable" },
  { symbol: "Cr", name: "Chromium", current: 0.8, target: 1.0, tolerance: 0.1, trend: "down" },
  { symbol: "Ni", name: "Nickel", current: 0.3, target: 0.25, tolerance: 0.05, trend: "up" },
]

const alerts = [
  { id: 1, type: "warning", message: "Carbon content approaching upper limit", time: "2 min ago" },
  { id: 2, type: "info", message: "Batch #A2024-001 analysis complete", time: "5 min ago" },
  { id: 3, type: "error", message: "Spectrometer calibration required", time: "8 min ago" },
]

// Mock data for charts
const anomalyTypeData = [
  { name: 'Sensor', value: 4 },
  { name: 'Process', value: 2 },
  { name: 'AI', value: 1 },
  { name: 'Equipment', value: 1 },
];
const anomalyTypeColors = ['#38bdf8', '#facc15', '#a3e635', '#f87171'];

const tempTrendData = [
  { time: '10:00', temp: 1620 },
  { time: '10:10', temp: 1630 },
  { time: '10:20', temp: 1640 },
  { time: '10:30', temp: 1650 },
  { time: '10:40', temp: 1660 },
  { time: '10:50', temp: 1655 },
  { time: '11:00', temp: 1650 },
];

const batchesByElement = [
  { element: 'C', batches: 3 },
  { element: 'Mn', batches: 2 },
  { element: 'Si', batches: 1 },
  { element: 'Cr', batches: 2 },
  { element: 'P', batches: 1 },
  { element: 'S', batches: 1 },
  { element: 'Fe', batches: 0 },
];

export default function DashboardPage() {
  const [furnaceTemp, setFurnaceTemp] = useState(1650)
  const [meltStage, setMeltStage] = useState(75)
  const [currentAlert, setCurrentAlert] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % alerts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const getElementStatus = (element: (typeof elements)[0]) => {
    const deviation = Math.abs(element.current - element.target)
    if (deviation <= element.tolerance * 0.5) return "good"
    if (deviation <= element.tolerance) return "warning"
    return "critical"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3" />
      case "down":
        return <TrendingDown className="w-3 h-3" />
      default:
        return <Minus className="w-3 h-3" />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-700 px-4 bg-slate-900">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Live Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center space-x-4">
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            Batch: A2024-001
          </Badge>
          <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
            <Clock className="w-3 h-3 mr-1" />
            {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Alerts Carousel */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {alerts[currentAlert].type === "error" && <AlertTriangle className="w-5 h-5 text-red-400" />}
                {alerts[currentAlert].type === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                {alerts[currentAlert].type === "info" && <CheckCircle className="w-5 h-5 text-blue-400" />}
                <div>
                  <p className="text-white font-medium">{alerts[currentAlert].message}</p>
                  <p className="text-sm text-slate-400">{alerts[currentAlert].time}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 bg-transparent">
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Visualizations */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Pie Chart: Anomaly Types */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Anomaly Types</CardTitle>
              <CardDescription className="text-slate-400">Breakdown of anomaly root causes</CardDescription>
            </CardHeader>
            <CardContent style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={anomalyTypeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {anomalyTypeData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={anomalyTypeColors[idx % anomalyTypeColors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Line Chart: Furnace Temperature Trend */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Furnace Temperature Trend</CardTitle>
              <CardDescription className="text-slate-400">Last hour temperature readings</CardDescription>
            </CardHeader>
            <CardContent style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tempTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[1600, 1700]} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart: Batches Affected by Element */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Batches Affected by Element</CardTitle>
              <CardDescription className="text-slate-400">Recent process impact by element</CardDescription>
            </CardHeader>
            <CardContent style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batchesByElement} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="element" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <RechartsTooltip />
                  <Bar dataKey="batches" fill="#facc15" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Periodic Table Visualization */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Element Composition</CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time values vs. target ranges with deviation indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {elements.map((element) => {
                    const status = getElementStatus(element)
                    return (
                      <div
                        key={element.symbol}
                        className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${getStatusColor(status)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-2xl font-bold">{element.symbol}</div>
                          <div className="flex items-center space-x-1">{getTrendIcon(element.trend)}</div>
                        </div>
                        <div className="text-xs opacity-75 mb-2">{element.name}</div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Current:</span>
                            <span className="font-mono">{element.current}%</span>
                          </div>
                          <div className="flex justify-between text-sm opacity-75">
                            <span>Target:</span>
                            <span className="font-mono">{element.target}%</span>
                          </div>
                          <Progress value={(element.current / (element.target * 2)) * 100} className="h-1" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Furnace Status Panel */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Thermometer className="w-5 h-5" />
                  <span>Furnace Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Temperature</span>
                    <span className="text-white font-mono">{furnaceTemp}°C</span>
                  </div>
                  <Progress value={(furnaceTemp / 2000) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Melt Stage</span>
                    <span className="text-white font-mono">{meltStage}%</span>
                  </div>
                  <Progress value={meltStage} className="h-2" />
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <Badge
                    variant="secondary"
                    className="bg-green-500/10 text-green-400 border-green-500/20 w-full justify-center"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Optimal Operating Range
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Controls */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Emergency Controls</CardTitle>
                <CardDescription className="text-slate-400">Admin-only emergency operations</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="bg-red-500/10 border-red-500/20 mb-4">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <AlertDescription className="text-red-400">
                    Emergency stop will halt all operations immediately
                  </AlertDescription>
                </Alert>
                <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700" disabled>
                  <StopCircle className="w-4 h-4 mr-2" />
                  Emergency Stop
                </Button>
                <p className="text-xs text-slate-500 mt-2 text-center">Requires administrator privileges</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
