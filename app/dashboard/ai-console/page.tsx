"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Brain, CheckCircle, Clock, Lightbulb, Target, BarChart3 } from "lucide-react"

const analysisData = [
  { element: "Carbon", current: 0.45, target: 0.4, gap: 0.05, confidence: 92 },
  { element: "Manganese", current: 1.2, target: 1.3, gap: -0.1, confidence: 88 },
  { element: "Chromium", current: 0.8, target: 1.0, gap: -0.2, confidence: 95 },
  { element: "Silicon", current: 0.25, target: 0.3, gap: -0.05, confidence: 90 },
]

const recommendations = [
  {
    id: 1,
    type: "Ferro-Manganese",
    quantity: "2.5 kg",
    cost: "$45.00",
    priority: "high",
    reason: "Correct Mn deficiency and improve hardenability",
  },
  {
    id: 2,
    type: "Ferro-Chrome",
    quantity: "1.8 kg",
    cost: "$72.00",
    priority: "medium",
    reason: "Enhance corrosion resistance",
  },
  {
    id: 3,
    type: "Silicon",
    quantity: "0.8 kg",
    cost: "$12.00",
    priority: "low",
    reason: "Improve deoxidation",
  },
]

const scenarios = [
  { name: "Conservative", cost: "$89.00", success: 85, time: "15 min" },
  { name: "Optimal", cost: "$129.00", success: 95, time: "12 min" },
  { name: "Aggressive", cost: "$156.00", success: 78, time: "8 min" },
]

export default function AIConsolePage() {
  const [selectedScenario, setSelectedScenario] = useState("Optimal")
  const [showExplanation, setShowExplanation] = useState(false)
  const [overallConfidence] = useState(91)

  return (
    <div className="flex-1 space-y-6 p-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-white">AI Recommendation Console</h1>
            <p className="text-slate-400">Intelligent alloy optimization suggestions</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
            <Brain className="w-3 h-3 mr-1" />
            Model Active
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            Confidence: {overallConfidence}%
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Analysis */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Current Analysis</span>
            </CardTitle>
            <CardDescription className="text-slate-400">Element-by-element gap visualization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisData.map((item) => (
              <div key={item.element} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{item.element}</span>
                  <Badge
                    variant="secondary"
                    className={`${item.gap > 0 ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}
                  >
                    {item.gap > 0 ? "+" : ""}
                    {item.gap.toFixed(2)}%
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Current: {item.current}%</span>
                  <span>Target: {item.target}%</span>
                </div>
                <div className="space-y-1">
                  <Progress value={(Math.abs(item.gap) / 0.2) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Confidence: {item.confidence}%</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Overall Confidence</span>
                <span className="text-white font-mono">{overallConfidence}%</span>
              </div>
              <Progress value={overallConfidence} className="h-3" />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full border-slate-600 text-slate-300 bg-transparent"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showExplanation ? "Hide" : "Show"} Model Explanation
            </Button>

            {showExplanation && (
              <Alert className="bg-blue-500/10 border-blue-500/20">
                <AlertDescription className="text-blue-400 text-sm">
                  SHAP values indicate Carbon content has highest impact on current prediction. Temperature and previous
                  batch history are secondary factors.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Recommended Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Recommended Actions</span>
            </CardTitle>
            <CardDescription className="text-slate-400">Optimized alloy additions with cost analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{rec.type}</span>
                  <Badge
                    variant="secondary"
                    className={`${
                      rec.priority === "high"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : rec.priority === "medium"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-green-500/10 text-green-400 border-green-500/20"
                    }`}
                  >
                    {rec.priority}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quantity:</span>
                    <span className="text-white font-mono">{rec.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cost:</span>
                    <span className="text-white font-mono">{rec.cost}</span>
                  </div>
                  <p className="text-slate-300 text-xs mt-2">{rec.reason}</p>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-white font-medium mb-3">Alternative Scenarios</h4>
              <div className="space-y-2">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.name}
                    onClick={() => setSelectedScenario(scenario.name)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      selectedScenario === scenario.name
                        ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                        : "bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{scenario.name}</span>
                      <span className="text-sm">{scenario.cost}</span>
                    </div>
                    <div className="flex justify-between text-xs opacity-75">
                      <span>Success: {scenario.success}%</span>
                      <span>Time: {scenario.time}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projected Outcome */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Projected Outcome</span>
            </CardTitle>
            <CardDescription className="text-slate-400">Post-addition simulation and cost impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-white font-medium">Expected Results</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400">95%</div>
                  <div className="text-xs text-green-400">Success Rate</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-400">12m</div>
                  <div className="text-xs text-blue-400">Est. Time</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-medium">Cost Impact</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Material Cost:</span>
                  <span className="text-white">$129.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Processing Cost:</span>
                  <span className="text-white">$45.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Potential Savings:</span>
                  <span className="text-green-400">$280.00</span>
                </div>
                <div className="border-t border-slate-700 pt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-white">Net Benefit:</span>
                    <span className="text-green-400">+$106.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-medium">Historical Accuracy</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Similar Cases:</span>
                  <span className="text-white">47</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Avg. Accuracy:</span>
                  <span className="text-white">89.4%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Last 30 Days:</span>
                  <span className="text-green-400">92.1%</span>
                </div>
              </div>
              <Progress value={92} className="h-2" />
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-700">
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Recommendations
              </Button>
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 bg-transparent">
                <Clock className="w-4 h-4 mr-2" />
                Schedule for Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
