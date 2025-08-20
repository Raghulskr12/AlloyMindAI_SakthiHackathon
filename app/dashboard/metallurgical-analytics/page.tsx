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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart
} from "recharts"
import { 
  TrendingUp, 
  Brain, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Activity,
  DollarSign,
  Weight,
  BarChart3,
  Settings,
  Users,
  Clock
} from "lucide-react"
import { MetallurgicalService, MetallurgicalData } from "@/lib/services/metallurgical-service"

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16']

export default function MetallurgicalAnalyticsPage() {
  const [metallurgicalData, setMetallurgicalData] = useState<MetallurgicalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<'7days' | '30days' | '90days'>('30days')
  const [alloyGrade, setAlloyGrade] = useState('all')
  const [operator, setOperator] = useState('all')

  useEffect(() => {
    fetchData()
  }, [period, alloyGrade, operator])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await MetallurgicalService.getMetallurgicalData(period, alloyGrade, operator)
      setMetallurgicalData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const chartData = metallurgicalData ? MetallurgicalService.getChartData(metallurgicalData) : null
  const metrics = metallurgicalData ? MetallurgicalService.getMetricsFromData(metallurgicalData) : []
  const topCostElements = metallurgicalData ? MetallurgicalService.getTopCostElements(metallurgicalData) : []
  const mostEditedElements = metallurgicalData ? MetallurgicalService.getMostEditedElements(metallurgicalData) : []
  const bestModels = metallurgicalData ? MetallurgicalService.getBestPerformingModels(metallurgicalData) : []
  const recentInsights = metallurgicalData ? MetallurgicalService.getRecentBatchInsights(metallurgicalData) : null

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
          <h1 className="text-xl font-semibold text-white">Metallurgical Analytics</h1>
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
                    <SelectItem value="7days" className="text-white">7 Days</SelectItem>
                    <SelectItem value="30days" className="text-white">30 Days</SelectItem>
                    <SelectItem value="90days" className="text-white">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-400">Alloy Grade:</label>
                <Select value={alloyGrade} onValueChange={setAlloyGrade}>
                  <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-white">All Grades</SelectItem>
                    <SelectItem value="EN1563" className="text-white">EN1563</SelectItem>
                    <SelectItem value="ASTMA536_UPDATED" className="text-white">ASTMA536 Updated</SelectItem>
                    <SelectItem value="ASTMA395_UPDATED" className="text-white">ASTMA395 Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-400">Operator:</label>
                <Select value={operator} onValueChange={setOperator}>
                  <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-white">All Operators</SelectItem>
                    <SelectItem value="John Doe" className="text-white">John Doe</SelectItem>
                    <SelectItem value="Jane Smith" className="text-white">Jane Smith</SelectItem>
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
              
              <Button 
                onClick={async () => {
                  try {
                    setLoading(true)
                    const response = await fetch('/api/analytics/metallurgical/sample-data', {
                      method: 'POST'
                    })
                    if (response.ok) {
                      await fetchData()
                    }
                  } catch (err) {
                    console.error('Error generating sample data:', err)
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
                variant="outline" 
                className="border-green-600 text-green-300 bg-transparent"
              >
                Generate Sample Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-white">Loading metallurgical data...</span>
            </div>
          </div>
        ) : error ? (
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="pt-6">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        ) : metallurgicalData && chartData ? (
          <>
            {/* Batch At-a-Glance */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-400">₹{metallurgicalData.overview.totalCost.toLocaleString()}</p>
                      <p className="text-sm text-slate-400">Total Cost</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-400">{metallurgicalData.overview.totalAdditions.toFixed(1)} kg</p>
                      <p className="text-sm text-slate-400">Total Additions</p>
                    </div>
                    <Weight className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-purple-400">₹{metallurgicalData.overview.avgCostPerKg.toFixed(2)}</p>
                      <p className="text-sm text-slate-400">Cost per Kg</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-400">{metallurgicalData.overview.totalBatches}</p>
                      <p className="text-sm text-slate-400">Total Batches</p>
                    </div>
                    <Activity className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Composition Gap Analysis */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Composition Gap Analysis</CardTitle>
                  <CardDescription className="text-slate-400">Pre vs Target vs Post composition for each element</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      preComposition: { label: "Pre", color: "#EF4444" },
                      targetComposition: { label: "Target", color: "#10B981" },
                      postComposition: { label: "Post", color: "#3B82F6" }
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData.compositionGap}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="element" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="preComposition" fill="#EF4444" name="Pre Composition" />
                        <Bar dataKey="targetComposition" fill="#10B981" name="Target Composition" />
                        <Bar dataKey="postComposition" fill="#3B82F6" name="Post Composition" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Cost Contribution */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Cost Contribution by Element</CardTitle>
                  <CardDescription className="text-slate-400">Total cost breakdown showing most expensive adjustments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      totalCost: { label: "Total Cost (₹)", color: "#F59E0B" }
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.costBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="element" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="totalCost" fill="#F59E0B" name="Total Cost (₹)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Weight of Additions & AI Performance */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Weight of Additions</CardTitle>
                  <CardDescription className="text-slate-400">Physical weight of materials added per element</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      avgOriginalKg: { label: "Original (kg)", color: "#EF4444" },
                      avgFinalKg: { label: "Final (kg)", color: "#10B981" }
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData.weightAdditions}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="element" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="avgOriginalKg" fill="#EF4444" name="Original (kg)" />
                        <Bar dataKey="avgFinalKg" fill="#10B981" name="Final (kg)" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* AI Performance */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">AI Recommendations & Performance</CardTitle>
                  <CardDescription className="text-slate-400">Model confidence, accuracy, and approval rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      confidence: { label: "Confidence %", color: "#3B82F6" },
                      accuracy: { label: "Accuracy %", color: "#10B981" },
                      approvalRate: { label: "Approval %", color: "#8B5CF6" }
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData.aiPerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="model" stroke="#9CA3AF" />
                        <YAxis domain={[0, 100]} stroke="#9CA3AF" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="confidence" fill="#3B82F6" name="Confidence %" />
                        <Bar dataKey="accuracy" fill="#10B981" name="Accuracy %" />
                        <Bar dataKey="approvalRate" fill="#8B5CF6" name="Approval %" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Key Metallurgical Metrics</CardTitle>
                    <CardDescription className="text-slate-400">
                      Performance indicators and targets for process optimization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {metrics.map((metric) => (
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
                                {metric.unit || ""}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Target:</span>
                              <span className="text-slate-400 font-mono">
                                {metric.target}
                                {metric.unit || ""}
                              </span>
                            </div>
                            <Progress
                              value={
                                metric.unit === "₹" || metric.unit === "kg"
                                  ? Math.min(100, (metric.value / metric.target) * 100)
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

              {/* Insights Panel */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Insights</CardTitle>
                  <CardDescription className="text-slate-400">Key findings and recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Top Cost Elements */}
                  <div>
                    <h4 className="text-white font-medium mb-2">Top Cost Elements</h4>
                    <div className="space-y-2">
                      {topCostElements.map((element, index) => (
                        <div key={element.element} className="flex justify-between text-sm">
                          <span className="text-slate-400">{element.element}:</span>
                          <span className="text-white">₹{element.totalCost.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <h4 className="text-white font-medium mb-2">Most Edited Elements</h4>
                    <div className="space-y-2">
                      {mostEditedElements.map((element) => (
                        <div key={element.element} className="flex justify-between text-sm">
                          <span className="text-slate-400">{element.element}:</span>
                          <span className="text-white">{element.editFrequency}%</span>
                        </div>
                      ))}
                    </div>
                  </div>




                </CardContent>
              </Card>
            </div>

            {/* Trend Analysis */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Trends</CardTitle>
                <CardDescription className="text-slate-400">Daily trends in cost, confidence, and approval rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    avgTotalCost: { label: "Avg Cost (₹)", color: "#F59E0B" },
                    avgConfidence: { label: "Confidence %", color: "#3B82F6" },
                    approvalRate: { label: "Approval %", color: "#10B981" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData.trendAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis yAxisId="left" stroke="#9CA3AF" />
                      <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="avgTotalCost"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={{ fill: "#F59E0B", strokeWidth: 2, r: 3 }}
                        name="Avg Cost (₹)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgConfidence"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
                        name="Confidence %"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="approvalRate"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
                        name="Approval %"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recent Batches Table */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Batch Analysis</CardTitle>
                <CardDescription className="text-slate-400">Detailed view of recent batches with composition changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left text-slate-400 py-2">Batch ID</th>
                        <th className="text-left text-slate-400 py-2">Alloy Grade</th>
                        <th className="text-left text-slate-400 py-2">Operator</th>
                        <th className="text-left text-slate-400 py-2">Weight (kg)</th>
                        <th className="text-left text-slate-400 py-2">Total Cost (₹)</th>
                        <th className="text-left text-slate-400 py-2">Additions (kg)</th>
                        <th className="text-left text-slate-400 py-2">Confidence</th>
                        <th className="text-left text-slate-400 py-2">Outcome</th>
                        <th className="text-left text-slate-400 py-2">Edited</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metallurgicalData.recentBatches.slice(0, 10).map((batch) => (
                        <tr key={batch.batchId} className="border-b border-slate-700/50">
                          <td className="py-2 text-white font-mono">{batch.batchId}</td>
                          <td className="py-2 text-white">{batch.alloyGrade}</td>
                          <td className="py-2 text-white">{batch.operator}</td>
                          <td className="py-2 text-white">{batch.batchWeight}</td>
                          <td className="py-2 text-white">₹{batch.totalCost.toLocaleString()}</td>
                          <td className="py-2 text-white">{batch.totalAdditions.toFixed(1)}</td>
                          <td className="py-2 text-white">{batch.confidence}%</td>
                          <td className="py-2">
                            <Badge 
                              variant="secondary" 
                              className={
                                batch.outcome === 'approved' 
                                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                  : 'bg-red-500/10 text-red-400 border-red-500/20'
                              }
                            >
                              {batch.outcome}
                            </Badge>
                          </td>
                          <td className="py-2">
                            {batch.metallurgistEdits ? (
                              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                                Edited
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                                AI Only
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  )
}
