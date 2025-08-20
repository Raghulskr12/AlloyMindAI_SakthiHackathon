"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  PieChart,
  Pie,
  Cell
} from "recharts"
import { TrendingUp, Brain, Target, AlertTriangle, CheckCircle, RefreshCw, Activity } from "lucide-react"
import { AnalyticsService, PerformanceData, ModelHealthData } from "@/lib/services/analytics-service"

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444']

export default function PerformancePage() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [healthData, setHealthData] = useState<ModelHealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<'30days' | '6months' | '1year'>('6months')
  const [selectedModel, setSelectedModel] = useState('all')

  useEffect(() => {
    fetchData()
  }, [period, selectedModel])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [perfData, healthData] = await Promise.all([
        AnalyticsService.getPerformanceData(period, selectedModel),
        AnalyticsService.getModelHealth()
      ])
      
      setPerformanceData(perfData)
      setHealthData(healthData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const [chartData, setChartData] = useState<any>(null)
  
  useEffect(() => {
    if (performanceData) {
      AnalyticsService.getChartData(period).then(setChartData)
    }
  }, [performanceData, period])
  const modelMetrics = (performanceData && healthData) ? 
    AnalyticsService.getMetricsFromData(performanceData, healthData) : []
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
    <div className="flex flex-col min-h-screen bg-slate-900">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-700 px-4 bg-slate-900">
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-semibold text-white">AI Performance Analytics</h1>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6">
        {/* Controls */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-400">Period:</label>
                <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                  <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="30days" className="text-white">30 Days</SelectItem>
                    <SelectItem value="6months" className="text-white">6 Months</SelectItem>
                    <SelectItem value="1year" className="text-white">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-400">Model:</label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-white">All Models</SelectItem>
                    <SelectItem value="MULTI_GRADE" className="text-white">Multi-Grade</SelectItem>
                    <SelectItem value="ASTMA536_UPDATED" className="text-white">ASTMA536 Updated</SelectItem>
                    <SelectItem value="ASTMA395_UPDATED" className="text-white">ASTMA395 Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={fetchData} 
                disabled={loading}
                variant="outline" 
                className="border-slate-600 text-slate-300 bg-transparent"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-white">Loading performance data...</span>
            </div>
          </div>
        ) : error ? (
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="pt-6">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        ) : performanceData && healthData ? (
          <>
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-400">{performanceData.overview.avgConfidence}%</p>
                      <p className="text-sm text-slate-400">Avg Confidence</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-400">{performanceData.overview.totalPredictions}</p>
                      <p className="text-sm text-slate-400">Total Predictions</p>
                    </div>
                    <Brain className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-purple-400">{healthData.performance.avgResponseTime}s</p>
                      <p className="text-sm text-slate-400">Avg Response Time</p>
                    </div>
                    <Target className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-400">₹{performanceData.overview.avgTotalCost}</p>
                      <p className="text-sm text-slate-400">Avg Cost per Batch</p>
                    </div>
                    <Activity className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}

        {chartData && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Accuracy Trend */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Trend</CardTitle>
                <CardDescription className="text-slate-400">Model performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    accuracy: {
                      label: "Accuracy %",
                      color: "#10B981",
                    },
                    confidence: {
                      label: "Confidence %",
                      color: "#3B82F6",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.accuracyChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis domain={[70, 100]} stroke="#9CA3AF" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                        name="Model Accuracy"
                      />
                      <Line
                        type="monotone"
                        dataKey="confidence"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
                        name="Avg Confidence"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Model Usage Distribution */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Model Usage Distribution</CardTitle>
                <CardDescription className="text-slate-400">Usage percentage by model type</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    usage: {
                      label: "Usage %",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.modelUsageChart}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.modelUsageChart.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        )}

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
          {healthData && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Health</CardTitle>
                <CardDescription className="text-slate-400">Current system status and resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Version:</span>
                    <span className="text-white font-mono">{healthData.systemStatus.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Uptime:</span>
                    <span className="text-white">{healthData.systemStatus.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Throughput:</span>
                    <span className="text-white">{healthData.performance.throughput}/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Success Rate:</span>
                    <span className="text-white">{healthData.performance.successRate}%</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <h4 className="text-white font-medium mb-3">Resource Usage</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Memory Usage</span>
                      <span className="text-white text-sm">{healthData.resources.memoryUsage}%</span>
                    </div>
                    <Progress value={healthData.resources.memoryUsage} className="h-1" />

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">CPU Usage</span>
                      <span className="text-white text-sm">{healthData.resources.cpuUsage}%</span>
                    </div>
                    <Progress value={healthData.resources.cpuUsage} className="h-1" />

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Queue Size</span>
                      <span className="text-white text-sm">{healthData.resources.queueSize} pending</span>
                    </div>
                    <Progress value={Math.min(100, healthData.resources.queueSize * 10)} className="h-1" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <Badge
                    variant="secondary"
                    className={`w-full justify-center ${
                      healthData.systemStatus.status === 'healthy' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : healthData.systemStatus.status === 'warning'
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {healthData.systemStatus.status === 'healthy' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 mr-1" />
                    )}
                    System {healthData.systemStatus.status}
                  </Badge>
                </div>

                {healthData.alerts.length > 0 && (
                  <div className="pt-4 border-t border-slate-700">
                    <h4 className="text-white font-medium mb-3">Recent Alerts</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {healthData.alerts.slice(0, 3).map((alert, index) => (
                        <div key={index} className="text-xs p-2 rounded bg-slate-700/30">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              alert.type === 'warning' ? 'bg-yellow-400' : 
                              alert.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                            }`} />
                            <span className="text-slate-300">{alert.message}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
