"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Thermometer,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Bell,
  Zap,
  Target,
  DollarSign,
  Timer,
  Gauge
} from "lucide-react"
import {
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

// Mock data
const systemStatus = {
  furnaceTemp: 1650,
  activeBatches: 3,
  systemHealth: 98,
  alertCount: 2
}

const elements = [
  { symbol: "Fe", name: "Iron", current: 85.2, target: 85.0, min: 84.0, max: 86.0, trend: "stable" },
  { symbol: "C", name: "Carbon", current: 0.45, target: 0.4, min: 0.35, max: 0.45, trend: "up" },
  { symbol: "Mn", name: "Manganese", current: 1.2, target: 1.3, min: 1.2, max: 1.4, trend: "down" },
  { symbol: "Si", name: "Silicon", current: 0.25, target: 0.3, min: 0.25, max: 0.35, trend: "stable" },
  { symbol: "P", name: "Phosphorus", current: 0.025, target: 0.03, min: 0.025, max: 0.035, trend: "up" },
  { symbol: "S", name: "Sulfur", current: 0.015, target: 0.02, min: 0.015, max: 0.025, trend: "stable" },
  { symbol: "Cr", name: "Chromium", current: 0.8, target: 1.0, min: 0.9, max: 1.1, trend: "down" },
  { symbol: "Ni", name: "Nickel", current: 0.3, target: 0.25, min: 0.2, max: 0.3, trend: "up" }
]

const temperatureTrend = [
  { time: '10:00', temp: 1620 },
  { time: '10:15', temp: 1635 },
  { time: '10:30', temp: 1648 },
  { time: '10:45', temp: 1652 },
  { time: '11:00', temp: 1650 },
  { time: '11:15', temp: 1649 },
  { time: '11:30', temp: 1651 }
]

const costScenarios = [
  {
    scenario: 'Conservative',
    cost: 85,
    time: 95,
    successRate: 98,
    waste: 15,
    actualCost: '$142',
    actualTime: '15m'
  },
  {
    scenario: 'Optimal',
    cost: 95,
    time: 85,
    successRate: 95,
    waste: 25,
    actualCost: '$129',
    actualTime: '12m'
  },
  {
    scenario: 'Aggressive',
    cost: 70,
    time: 60,
    successRate: 88,
    waste: 40,
    actualCost: '$98',
    actualTime: '8m'
  }
]

const anomalies = [
  { id: 1, type: "sensor", severity: "medium", issue: "Carbon sensor drift", related: ["c-analysis", "temp-correlation"] },
  { id: 2, type: "process", severity: "low", issue: "Mn addition timing", related: ["batch-timing"] },
  { id: 3, type: "ai", severity: "high", issue: "Model confidence drop", related: ["prediction-accuracy"] },
  { id: 4, type: "equipment", severity: "medium", issue: "Furnace door seal", related: ["temp-loss", "efficiency"] }
]

const furnaceZones = [
  { zone: "Zone 1", temp: 1650, status: "optimal", efficiency: 96, pressure: 2.1 },
  { zone: "Zone 2", temp: 1645, status: "optimal", efficiency: 94, pressure: 2.0 },
  { zone: "Zone 3", temp: 1655, status: "warning", efficiency: 88, pressure: 2.3 },
  { zone: "Zone 4", temp: 1640, status: "optimal", efficiency: 97, pressure: 1.9 }
]

export default function DashboardPage() {
  const [selectedElement, setSelectedElement] = useState(null)
  const [selectedZone, setSelectedZone] = useState(null)

  const getElementStatus = (element) => {
    if (element.current >= element.min && element.current <= element.max) return "good"
    if (element.current >= element.min * 0.95 && element.current <= element.max * 1.05) return "warning"
    return "critical"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "good": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "warning": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-3 h-3 text-green-400" />
      case "down": return <TrendingDown className="w-3 h-3 text-red-400" />
      default: return <Minus className="w-3 h-3 text-slate-400" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header Section - Real-time Status Bar */}
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Furnace Temp</p>
                  <p className="text-2xl font-bold text-white">{systemStatus.furnaceTemp}°C</p>
                </div>
                <Thermometer className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Batches</p>
                  <p className="text-2xl font-bold text-white">{systemStatus.activeBatches}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">System Health</p>
                  <p className="text-2xl font-bold text-white">{systemStatus.systemHealth}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Alerts</p>
                  <p className="text-2xl font-bold text-white">{systemStatus.alertCount}</p>
                </div>
                <div className="relative">
                  <Bell className="w-8 h-8 text-yellow-400" />
                  {systemStatus.alertCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">{systemStatus.alertCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Core Visualization Modules */}
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6 mb-6">
        {/* A. Interactive Periodic Table */}
        <div className="xl:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Composition Analysis</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Interactive element monitoring - click for detailed trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {elements.map((element) => {
                  const status = getElementStatus(element)
                  const deviation = ((element.current - element.target) / element.target * 100).toFixed(1)
                  return (
                    <div
                      key={element.symbol}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 hover:shadow-lg ${getStatusColor(status)}`}
                      onClick={() => setSelectedElement(element)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xl font-bold">{element.symbol}</div>
                        {getTrendIcon(element.trend)}
                      </div>
                      <div className="text-xs opacity-75 mb-2">{element.name}</div>
                      <div className="text-lg font-mono mb-1">{element.current}%</div>
                      <div className="text-xs opacity-75 mb-1">Target: {element.target}%</div>
                      <div className="flex items-center text-xs">
                        <span className={`${deviation > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {deviation > 0 ? '▲' : '▼'} {Math.abs(deviation)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* B. Advanced Furnace Temperature Control */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Thermometer className="w-5 h-5" />
              <span>Furnace Control Center</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Real-time temperature monitoring & control
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Temperature Gauge */}
            <div className="relative">
              <div className="w-32 h-32 mx-auto">
                <div className="relative w-full h-full">
                  {/* Circular progress ring */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${(systemStatus.furnaceTemp / 2000) * 251.2} 251.2`}
                      className="text-orange-400 transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{systemStatus.furnaceTemp}</div>
                      <div className="text-xs text-slate-400">°C</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Optimal Range
                </Badge>
              </div>
            </div>

            {/* Temperature Trend Chart */}
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureTrend}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                  />
                  <YAxis hide domain={[1600, 1700]} />
                  <Line 
                    type="monotone" 
                    dataKey="temp" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 4, fill: '#f97316' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#64748b" 
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    dot={false}
                  />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Zone Status Grid */}
            <div className="grid grid-cols-2 gap-2">
              {furnaceZones.map((zone) => (
                <div
                  key={zone.zone}
                  className={`p-2 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                    zone.status === 'optimal' ? 'bg-green-500/10 border border-green-500/30' :
                    zone.status === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                    'bg-red-500/10 border border-red-500/30'
                  }`}
                  onClick={() => setSelectedZone(zone)}
                >
                  <div className="text-xs font-medium text-white">{zone.zone}</div>
                  <div className="text-sm font-mono text-orange-400">{zone.temp}°C</div>
                  <div className="text-xs text-slate-400">{zone.efficiency}% eff</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid xl:grid-cols-3 gap-6 mb-6">
        {/* C. Cost Optimization Matrix */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Cost Optimization</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Scenario comparison with savings calculator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={costScenarios}>
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis dataKey="scenario" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <Radar
                    name="Cost Efficiency"
                    dataKey="cost"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.1}
                  />
                  <Radar
                    name="Time Efficiency"
                    dataKey="time"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                  />
                  <Radar
                    name="Success Rate"
                    dataKey="successRate"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.1}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                {costScenarios.map((scenario) => (
                  <div key={scenario.scenario} className="bg-slate-700/50 p-2 rounded transition-all hover:bg-slate-700/70">
                    <div className="font-bold text-white">{scenario.scenario}</div>
                    <div className="text-green-400">{scenario.actualCost}</div>
                    <div className="text-blue-400">{scenario.actualTime}</div>
                    <div className="text-yellow-400">{scenario.successRate}%</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* D. 3D Furnace Visualization */}
        <div className="xl:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Gauge className="w-5 h-5" />
                <span>Advanced Furnace Monitoring</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                3D temperature mapping with real-time analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* 3D Furnace Visual */}
                <div className="relative">
                  <div className="w-full h-64 bg-gradient-to-br from-slate-900 via-orange-900/20 to-red-900/30 rounded-xl relative overflow-hidden border border-slate-700/50">
                    {/* Furnace structure */}
                    <div className="absolute inset-4 bg-gradient-to-b from-orange-800/30 to-red-800/50 rounded-lg border-2 border-orange-500/30">
                      {/* Temperature zones */}
                      {furnaceZones.map((zone, index) => (
                        <div
                          key={zone.zone}
                          className={`absolute cursor-pointer group transition-all duration-300 hover:scale-110 ${
                            index === 0 ? 'top-4 left-4 w-16 h-12' :
                            index === 1 ? 'top-4 right-4 w-16 h-12' :
                            index === 2 ? 'bottom-4 left-4 w-16 h-12' :
                            'bottom-4 right-4 w-16 h-12'
                          }`}
                          onClick={() => setSelectedZone(zone)}
                        >
                          <div className={`w-full h-full rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                            zone.status === 'optimal' ? 'bg-green-500/40 border-2 border-green-400 text-green-200' :
                            zone.status === 'warning' ? 'bg-yellow-500/40 border-2 border-yellow-400 text-yellow-200' :
                            'bg-red-500/40 border-2 border-red-400 text-red-200'
                          } ${selectedZone?.zone === zone.zone ? 'ring-2 ring-white/50' : ''}`}>
                            <div className="text-center">
                              <div className="text-xs">{zone.zone}</div>
                              <div className="font-mono">{zone.temp}°</div>
                            </div>
                          </div>
                          
                          {/* Enhanced tooltip */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-800/95 backdrop-blur-sm p-3 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-20 border border-slate-600/50">
                            <div className="font-bold text-orange-400">{zone.zone}</div>
                            <div className="space-y-1 mt-1">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Temperature:</span>
                                <span className="text-orange-300">{zone.temp}°C</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Efficiency:</span>
                                <span className="text-green-300">{zone.efficiency}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Pressure:</span>
                                <span className="text-blue-300">{zone.pressure} bar</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Central melt pool */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-radial from-orange-400/60 via-red-500/40 to-transparent rounded-full animate-pulse">
                        <div className="w-full h-full bg-gradient-to-br from-yellow-400/20 to-red-600/40 rounded-full animate-spin" style={{animationDuration: '8s'}} />
                      </div>
                    </div>
                    
                    {/* Animated heat waves */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-orange-500/10 to-transparent animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent animate-pulse" style={{animationDelay: '1s'}} />
                  </div>
                </div>

                {/* Zone Details Panel */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {furnaceZones.map((zone) => (
                      <div
                        key={zone.zone}
                        className={`p-3 rounded-lg cursor-pointer transition-all hover:scale-105 border ${
                          selectedZone?.zone === zone.zone ? 'ring-2 ring-blue-400' : ''
                        } ${
                          zone.status === 'optimal' ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' :
                          zone.status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20' :
                          'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                        }`}
                        onClick={() => setSelectedZone(zone)}
                      >
                        <div className="text-sm font-medium text-white mb-1">{zone.zone}</div>
                        <div className="text-lg font-mono text-orange-400 mb-1">{zone.temp}°C</div>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>{zone.efficiency}% eff</span>
                          <span>{zone.pressure} bar</span>
                        </div>
                        <div className="mt-2">
                          <Progress 
                            value={zone.efficiency} 
                            className="h-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedZone && (
                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                      <h4 className="text-white font-medium mb-3">{selectedZone.zone} Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current Temperature:</span>
                          <span className="text-orange-400 font-mono">{selectedZone.temp}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Operating Efficiency:</span>
                          <span className="text-green-400">{selectedZone.efficiency}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Pressure Reading:</span>
                          <span className="text-blue-400">{selectedZone.pressure} bar</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <Badge className={`${
                            selectedZone.status === 'optimal' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            selectedZone.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}>
                            {selectedZone.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Anomaly Constellation Map */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Anomaly Constellation Map</CardTitle>
          <CardDescription className="text-slate-400">
            Force-directed view of detected issues and their relationships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-48 bg-slate-900/50 rounded-lg overflow-hidden">
            {anomalies.map((anomaly, index) => {
              const positions = [
                { x: '20%', y: '30%' },
                { x: '70%', y: '20%' },
                { x: '30%', y: '70%' },
                { x: '80%', y: '60%' }
              ]
              return (
                <div
                  key={anomaly.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: positions[index].x, top: positions[index].y }}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-110 ${
                    anomaly.severity === 'high' ? 'bg-red-500/30 border-2 border-red-400' :
                    anomaly.severity === 'medium' ? 'bg-yellow-500/30 border-2 border-yellow-400' :
                    'bg-blue-500/30 border-2 border-blue-400'
                  }`}>
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-800 p-2 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    <div className="font-bold">{anomaly.issue}</div>
                    <div className="text-slate-400">Type: {anomaly.type}</div>
                    <div className="text-slate-400">Severity: {anomaly.severity}</div>
                  </div>
                </div>
              )
            })}
            {/* Connection lines between related anomalies */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="20%" y1="30%" x2="30%" y2="70%" stroke="#64748b" strokeWidth="1" opacity="0.5" strokeDasharray="2,2" />
              <line x1="70%" y1="20%" x2="80%" y2="60%" stroke="#64748b" strokeWidth="1" opacity="0.5" strokeDasharray="2,2" />
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}