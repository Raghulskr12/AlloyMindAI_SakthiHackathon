"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, CheckCircle, Clock, Lightbulb, Target, BarChart3, ChevronDown, ChevronUp } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Mock data with more realistic metallurgical values
const alloyGrades = [
  { id: "AISI-4140", name: "AISI 4140 Chrome-Moly" },
  { id: "SAE-1045", name: "SAE 1045 Carbon Steel" },
  { id: "DIN-1.2344", name: "DIN 1.2344 Tool Steel" }
]

const analysisData = [
  { 
    element: "Carbon", 
    symbol: "C", 
    current: 0.45, 
    target: { min: 0.38, max: 0.43 }, 
    confidence: 92,
    effect: "Strength ↑↑, Ductility ↓" 
  },
  { 
    element: "Manganese", 
    symbol: "Mn", 
    current: 1.2, 
    target: { min: 1.25, max: 1.35 }, 
    confidence: 88,
    effect: "Hardenability ↑, Toughness ↑" 
  },
  // More elements...
]

const recommendations = [
  {
    id: 1,
    type: "FeMn (High Carbon)",
    formula: "FeMn80C7.5",
    quantity: { value: 2.5, unit: "kg" },
    cost: 45.00,
    priority: "high",
    impact: "Mn +0.15%, C +0.02%",
    reason: "Corrects Mn deficiency while minimizing C increase"
  },
  // More recommendations...
]

export default function AIConsole() {
  const [currentGrade, setCurrentGrade] = useState(alloyGrades[0])
  const [expandedElement, setExpandedElement] = useState<string | null>(null)
  const [approved, setApproved] = useState(false)
  
  // Toggle element detail view
  const toggleElement = (element: string) => {
    setExpandedElement(expandedElement === element ? null : element)
  }

  return (
    <div className="flex-1 space-y-6 p-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-white">Alloy Optimization Console</h1>
            <p className="text-slate-400">AI-powered alloy composition and cost optimization</p>
          </div>
        </div>
      </div>
      {/* Header with Batch Info */}
      <Card className="bg-slate-800/50 border-slate-700 mb-8">
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-400">Alloy Grade</p>
              <select 
                value={currentGrade.id}
                onChange={(e) => setCurrentGrade(alloyGrades.find(g => g.id === e.target.value)!)}
                className="font-medium text-white bg-transparent border-none focus:outline-none"
              >
                {alloyGrades.map(grade => (
                  <option key={grade.id} value={grade.id} className="bg-slate-800 text-white">{grade.name}</option>
                ))}
              </select>
            </div>
            <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-400">Heat ID</p>
              <p className="font-mono font-medium text-white">#H-{Math.floor(Math.random()*9000)+1000}</p>
            </div>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <Brain className="w-4 h-4 mr-1" />
              AI Model Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Current Composition Analysis */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="text-blue-600" />
              <span>Current Composition</span>
            </CardTitle>
            <CardDescription className="text-slate-400">Real-time spectrometer analysis vs target</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisData.map(item => (
              <div key={item.element} className="border border-slate-600 rounded-lg overflow-hidden bg-slate-700/30">
                <button 
                  onClick={() => toggleElement(item.element)}
                  className={`w-full p-3 flex justify-between items-center ${expandedElement === item.element ? 'bg-blue-900/30' : 'hover:bg-slate-700/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <span className="font-mono text-sm text-blue-300">{item.symbol}</span>
                    </div>
                    <div>
                      <p className="font-medium text-left text-white">{item.element}</p>
                      <p className="text-xs text-slate-400 text-left">
                        Current: {item.current}% | Target: {item.target.min}–{item.target.max}%
                      </p>
                    </div>
                  </div>
                  {expandedElement === item.element ? <ChevronUp className="text-blue-400" /> : <ChevronDown className="text-slate-400" />}
                </button>
                
                {expandedElement === item.element && (
                  <div className="p-4 bg-slate-800 border-t border-slate-700">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-slate-400">Effect on Properties</p>
                        <p className="font-medium text-white">{item.effect}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Model Confidence</p>
                        <Progress value={item.confidence} className="h-2" />
                      </div>
                    </div>
                    <Alert className="bg-blue-500/10 border-blue-500/20">
                      <AlertDescription className="text-sm text-blue-200">
                        {item.element} content affects {item.effect.split(",")[0]}. 
                        {item.current < item.target.min ? " Below" : " Above"} optimal range.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckCircle className="text-green-600" />
              <span>Recommended Additions</span>
            </CardTitle>
            <CardDescription className="text-slate-400">Optimized material adjustments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map(rec => (
              <div key={rec.id} className="border border-slate-600 rounded-lg p-4 bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-white">{rec.type}</p>
                    <p className="text-sm text-slate-400 font-mono">{rec.formula}</p>
                  </div>
                 <Badge className={rec.priority === "high"
                   ? "bg-red-500/10 text-red-400 border-red-500/20"
                   : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                 }>
                   {rec.priority}
                 </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-slate-400">Quantity</p>
                    <p className="font-medium text-white">{rec.quantity.value} {rec.quantity.unit}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Impact</p>
                    <p className="font-medium text-white">{rec.impact}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Cost</p>
                    <p className="font-medium text-white">${rec.cost.toFixed(2)}</p>
                  </div>
                </div>
                
                <p className="text-sm text-slate-300">{rec.reason}</p>
              </div>
            ))}
            
            <Button 
              variant={approved ? "outline" : "default"} 
              className="w-full mt-4 border-slate-600 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300"
              onClick={() => setApproved(!approved)}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {approved ? "Approved ✓" : "Approve Recommendations"}
            </Button>
          </CardContent>
        </Card>

        {/* Projected Outcome */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="text-purple-600" />
              <span>Projected Outcome</span>
            </CardTitle>
            <CardDescription className="text-slate-400">Expected results after additions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Projected Composition */}
            <div>
              <h4 className="font-medium mb-3 text-white">Final Composition</h4>
              <div className="space-y-2">
                {analysisData.map(item => (
                  <div key={item.element} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-mono text-blue-300">{item.symbol}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">{item.element}</span>
                        <span className="font-mono text-white">
                          {item.current}% → {item.current + 0.1}%
                        </span>
                      </div>
                      <Progress 
                        value={((item.current + 0.1 - item.target.min) / (item.target.max - item.target.min)) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Cost Analysis */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <h4 className="font-medium mb-3 text-white">Cost Analysis</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Material Cost</span>
                  <span className="font-medium text-white">$129.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Potential Scrap Savings</span>
                  <span className="text-green-400 font-medium">-$280.00</span>
                </div>
                <div className="border-t border-slate-600 pt-2 flex justify-between font-medium">
                  <span className="text-white">Net Savings</span>
                  <span className="text-green-400">+$151.00</span>
                </div>
              </div>
            </div>
            
            {/* Quality Metrics */}
            <div>
              <h4 className="font-medium mb-3 text-white">Quality Projections</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">95%</div>
                  <p className="text-xs text-slate-400">Yield Strength</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">88%</div>
                  <p className="text-xs text-slate-400">Elongation</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">92%</div>
                  <p className="text-xs text-slate-400">Hardness</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}