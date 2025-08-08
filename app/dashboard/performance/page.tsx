"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, Brain, Target, AlertTriangle, CheckCircle } from "lucide-react"

const accuracyData = [
  { month: "Jan", accuracy: 87, predictions: 245 },
  { month: "Feb", accuracy: 89, predictions: 267 },
  { month: "Mar", accuracy: 91, predictions: 289 },
  { month: "Apr", accuracy: 88, predictions: 234 },
  { month: "May", accuracy: 93, predictions: 312 },
  { month: "Jun", accuracy: 95, predictions: 298 },
]

const featureImportance = [
  { feature: "Carbon", importance: 95 },
  { feature: "Temperature", importance: 87 },
  { feature: "Manganese", importance: 78 },
  { feature: "Silicon", importance: 65 },
  { feature: "Chromium", importance: 58 },
  { feature: "Batch History", importance: 52 },
]

const driftData = [
  { date: "Week 1", carbon: 0.02, manganese: 0.01, silicon: 0.03 },
  { date: "Week 2", carbon: 0.03, manganese: 0.02, silicon: 0.02 },
  { date: "Week 3", carbon: 0.05, manganese: 0.04, silicon: 0.01 },
  { date: "Week 4", carbon: 0.08, manganese: 0.06, silicon: 0.04 },
]

const modelMetrics = [
  { name: "Overall Accuracy", value: 94.2, target: 90, status: "good" },
  { name: "Precision", value: 91.8, target: 85, status: "good" },
  { name: "Recall", value: 89.5, target: 85, status: "good" },
  { name: "F1 Score", value: 90.6, target: 85, status: "good" },
  { name: "Response Time", value: 1.2, target: 2.0, status: "good", unit: "s" },
  { name: "Confidence Threshold", value: 87.3, target: 80, status: "warning" },
]

export default function PerformancePage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "warning":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "critical":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return <Target className="w-4 h-4 text-slate-400" />
    }
  }

  return (
    <>


      <div className="flex-1 space-y-6 p-6">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-400">94.2%</p>
                  <p className="text-sm text-slate-400">Overall Accuracy</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-400">1,745</p>
                  <p className="text-sm text-slate-400">Predictions This Month</p>
                </div>
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-400">1.2s</p>
                  <p className="text-sm text-slate-400">Avg Response Time</p>
                </div>
                <Target className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Accuracy Trend */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Accuracy Trend</CardTitle>
              <CardDescription className="text-slate-400">Model accuracy over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  accuracy: {
                    label: "Accuracy %",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accuracyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis domain={[80, 100]} stroke="#9CA3AF" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Feature Importance */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Feature Importance</CardTitle>
              <CardDescription className="text-slate-400">Radar chart showing model feature weights</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  importance: {
                    label: "Importance",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={featureImportance}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="feature" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                    <Radar
                      name="Importance"
                      dataKey="importance"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Model Metrics */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Model Metrics</CardTitle>
                <CardDescription className="text-slate-400">
                  Detailed performance indicators and targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {modelMetrics.map((metric) => (
                    <div key={metric.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{metric.name}</span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(metric.status)}
                          <Badge variant="secondary" className={getStatusColor(metric.status)}>
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Current:</span>
                          <span className="text-white font-mono">
                            {metric.value}
                            {metric.unit || "%"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Target:</span>
                          <span className="text-slate-400 font-mono">
                            {metric.target}
                            {metric.unit || "%"}
                          </span>
                        </div>
                        <Progress
                          value={
                            metric.unit === "s"
                              ? ((metric.target - metric.value) / metric.target) * 100
                              : (metric.value / metric.target) * 100
                          }
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Model Status */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Model Status</CardTitle>
              <CardDescription className="text-slate-400">Current model information and health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Version:</span>
                  <span className="text-white font-mono">v2.1.3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Updated:</span>
                  <span className="text-white">2 days ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Training Data:</span>
                  <span className="text-white">15,847 samples</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Model Size:</span>
                  <span className="text-white">2.3 GB</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <h4 className="text-white font-medium mb-3">Health Indicators</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Memory Usage</span>
                    <span className="text-white text-sm">67%</span>
                  </div>
                  <Progress value={67} className="h-1" />

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">CPU Usage</span>
                    <span className="text-white text-sm">23%</span>
                  </div>
                  <Progress value={23} className="h-1" />

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Prediction Queue</span>
                    <span className="text-white text-sm">3 pending</span>
                  </div>
                  <Progress value={15} className="h-1" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <Badge
                  variant="secondary"
                  className="bg-green-500/10 text-green-400 border-green-500/20 w-full justify-center"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Model Healthy
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Drift Detection */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Drift Detection Timeline</CardTitle>
            <CardDescription className="text-slate-400">Model drift indicators over the last 4 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                carbon: {
                  label: "Carbon Drift",
                  color: "hsl(var(--chart-1))",
                },
                manganese: {
                  label: "Manganese Drift",
                  color: "hsl(var(--chart-2))",
                },
                silicon: {
                  label: "Silicon Drift",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={driftData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="carbon"
                    stackId="1"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="manganese"
                    stackId="1"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="silicon"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
