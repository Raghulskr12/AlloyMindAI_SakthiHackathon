"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts'
import { Activity, Clock, DollarSign, TrendingUp, TrendingDown, Minus, RefreshCw, CheckCircle } from "lucide-react"
import { DashboardService, DashboardData, Element } from "@/lib/services/dashboard-service"

export default function ElementAnalysisDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedElement, setSelectedElement] = useState<Element | null>(null)
  const [timeFrame, setTimeFrame] = useState<"month" | "batch">("month")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (dashboardData?.elements && dashboardData.elements.length > 0) {
      setSelectedElement(dashboardData.elements[0])
    }
  }, [dashboardData])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await DashboardService.getDashboardData()
      setDashboardData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-400" />
      case "down": return <TrendingDown className="w-4 h-4 text-red-400" />
      default: return <Minus className="w-4 h-4 text-slate-400" />
    }
  }

  const getElementStatus = (element: Element) => {
    return DashboardService.getElementStatus(element)
  }

  const getStatusColor = (status: 'optimal' | 'warning' | 'critical') => {
    return DashboardService.getStatusColor(status)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <p className="text-red-400">{error}</p>
            <Button onClick={fetchDashboardData} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!dashboardData || !selectedElement) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <p className="text-white">No dashboard data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const elementCostData = dashboardData.elementCostData
  const elementTrendData = timeFrame === "month" ? dashboardData.monthlyTrends : dashboardData.batchHistory

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-700 px-4 bg-slate-900">
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-semibold text-white">Element Analysis Dashboard</h1>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6">
        {/* Controls */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button 
                onClick={fetchDashboardData} 
                disabled={loading}
                variant="outline" 
                className="border-slate-600 text-slate-300 bg-transparent"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              
              <Button 
                onClick={async () => {
                  try {
                    setLoading(true)
                    const response = await fetch('/api/analytics/metallurgical/sample-data', {
                      method: 'POST'
                    })
                    if (response.ok) {
                      await fetchDashboardData()
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
              <span className="text-white">Loading dashboard data...</span>
            </div>
          </div>
        ) : error ? (
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="pt-6">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        ) : dashboardData && selectedElement ? (
          <>
            {/* Current Batch Overview */}
            {dashboardData.currentBatch && (
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-400">{dashboardData.currentBatch.batchId}</p>
                        <p className="text-sm text-slate-400">Current Batch</p>
                      </div>
                      <Activity className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-green-400">₹{dashboardData.currentBatch.totalCost.toLocaleString()}</p>
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
                        <p className="text-2xl font-bold text-purple-400">{dashboardData.currentBatch.confidence}%</p>
                        <p className="text-sm text-slate-400">Confidence</p>
                      </div>
                      <Clock className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge 
                          variant="secondary" 
                          className={
                            dashboardData.currentBatch.outcome === 'approved' 
                              ? 'bg-green-500/10 text-green-400 border-green-500/20 text-lg px-3 py-1'
                              : 'bg-red-500/10 text-red-400 border-red-500/20 text-lg px-3 py-1'
                          }
                        >
                          {dashboardData.currentBatch.outcome}
                        </Badge>
                        <p className="text-sm text-slate-400 mt-1">Status</p>
                      </div>
                      <CheckCircle className={`w-8 h-8 ${
                        dashboardData.currentBatch.outcome === 'approved' 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid xl:grid-cols-3 gap-6">
              {/* Element Composition Overview */}
              <Card className="bg-slate-800/50 border-slate-700 xl:col-span-1">
                <CardHeader>
                  <CardTitle className="text-white">Element Composition</CardTitle>
                  <CardDescription className="text-slate-400">
                    Current batch element analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.elements.map((element) => (
                      <div
                        key={element.symbol}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                          selectedElement.symbol === element.symbol 
                            ? 'ring-2 ring-blue-400 bg-slate-700/50' 
                            : getStatusColor(getElementStatus(element))
                        }`}
                        onClick={() => setSelectedElement(element)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="text-xl font-bold">{element.symbol}</div>
                            <div className="text-sm text-slate-400">{element.name}</div>
                          </div>
                          {getTrendIcon(element.trend)}
                        </div>
                        <div className="flex justify-between mt-2">
                          <div className="text-lg font-mono">{element.current}%</div>
                          <div className="text-sm text-slate-400">
                            Target: {element.target}%
                          </div>
                        </div>
                        <div className="mt-1">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Min: {element.min}%</span>
                            <span>Max: {element.max}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Element Analysis */}
              <div className="xl:col-span-2 space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">
                          {selectedElement.name} ({selectedElement.symbol}) Analysis
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Detailed composition metrics and trends
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant={timeFrame === "batch" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setTimeFrame("batch")}
                        >
                          Batch View
                        </Button>
                        <Button 
                          variant={timeFrame === "month" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setTimeFrame("month")}
                        >
                          Monthly View
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Trend Chart */}
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={elementTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis 
                              dataKey={timeFrame === "month" ? "month" : "batch"} 
                              stroke="#64748b"
                            />
                            <YAxis 
                              domain={[
                                selectedElement.min * 0.95, 
                                selectedElement.max * 1.05
                              ]} 
                              stroke="#64748b"
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#1e293b',
                                borderColor: '#334155',
                                borderRadius: '0.5rem'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey={selectedElement.symbol} 
                              stroke="#3b82f6" 
                              strokeWidth={2}
                              activeDot={{ r: 6 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="target" 
                              stroke="#10b981" 
                              strokeWidth={2}
                              strokeDasharray="5 5"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Cost and Stats */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-800/70 p-3 rounded-lg border border-slate-700">
                            <div className="text-sm text-slate-400">Current Value</div>
                            <div className="text-2xl font-bold text-white">
                              {selectedElement.current}%
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              Target: {selectedElement.target}%
                            </div>
                          </div>
                          <div className="bg-slate-800/70 p-3 rounded-lg border border-slate-700">
                            <div className="text-sm text-slate-400">Cost Impact</div>
                            <div className="text-2xl font-bold text-white">
                              ₹{(selectedElement.current * selectedElement.costPerKg).toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              ₹{selectedElement.costPerKg.toFixed(2)}/kg
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-800/70 p-3 rounded-lg border border-slate-700">
                          <div className="text-sm text-slate-400 mb-2">Acceptable Range</div>
                          <div className="relative h-8 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="absolute h-full bg-green-500/30"
                              style={{
                                left: `${selectedElement.min}%`,
                                width: `${selectedElement.max - selectedElement.min}%`
                              }}
                            />
                            <div 
                              className="absolute top-0 h-full w-0.5 bg-green-400"
                              style={{ left: `${selectedElement.target}%` }}
                            />
                            <div 
                              className="absolute top-0 h-full w-1 bg-blue-400 rounded-full -ml-0.5"
                              style={{ left: `${selectedElement.current}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>{selectedElement.min}%</span>
                            <span>Target: {selectedElement.target}%</span>
                            <span>{selectedElement.max}%</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <div className="flex items-center">
                            {getTrendIcon(selectedElement.trend)}
                            <span className="ml-1 text-slate-400">Trend:</span>
                            <span className="ml-1 text-white capitalize">
                              {selectedElement.trend}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${
                              getElementStatus(selectedElement) === 'optimal' ? 'bg-green-500' :
                              getElementStatus(selectedElement) === 'warning' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                            <span className="ml-1 text-slate-400">Status:</span>
                            <span className="ml-1 text-white capitalize">
                              {getElementStatus(selectedElement)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cost and Batch Analysis */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Element Cost Distribution</CardTitle>
                      <CardDescription className="text-slate-400">
                        Cost contribution by element
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={elementCostData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#1e293b',
                                borderColor: '#334155',
                                borderRadius: '0.5rem'
                              }}
                            />
                            <Bar 
                              dataKey="cost" 
                              fill="#f59e0b" 
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Batch Performance</CardTitle>
                      <CardDescription className="text-slate-400">
                        Recent batch composition vs cost
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={dashboardData.batchHistory.slice(0, 3).map((batch: any) => ({
                            batch: batch.batch,
                            [selectedElement.symbol]: batch[selectedElement.symbol],
                            cost: batch.cost
                          }))}>
                            <PolarGrid stroke="#334155" />
                            <PolarAngleAxis dataKey="batch" stroke="#64748b" />
                            <PolarRadiusAxis angle={30} stroke="#64748b" />
                            <Radar
                              name={selectedElement.symbol}
                              dataKey={selectedElement.symbol}
                              stroke="#3b82f6"
                              fill="#3b82f6"
                              fillOpacity={0.2}
                            />
                            <Radar
                              name="Cost (₹)"
                              dataKey="cost"
                              stroke="#f59e0b"
                              fill="#f59e0b"
                              fillOpacity={0.2}
                            />
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}