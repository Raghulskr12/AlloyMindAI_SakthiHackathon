"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Download,
  Filter,
  CalendarIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  User,
} from "lucide-react"
import { format } from "date-fns"

const decisionHistory = [
  {
    id: "D2024-001",
    timestamp: "2024-01-15 14:30:22",
    operator: "John Doe",
    batchId: "A2024-001",
    alloyGrade: "AISI 4140",
    preComposition: { C: 0.45, Mn: 1.2, Cr: 0.8, Si: 0.25 },
    postComposition: { C: 0.4, Mn: 1.3, Cr: 1.0, Si: 0.3 },
    outcome: "success",
    costImpact: -156.0,
    recommendations: ["Ferro-Manganese 2.5kg", "Ferro-Chrome 1.8kg"],
    confidence: 92,
  },
  {
    id: "D2024-002",
    timestamp: "2024-01-15 16:45:10",
    operator: "Sarah Wilson",
    batchId: "A2024-002",
    alloyGrade: "AISI 1045",
    preComposition: { C: 0.48, Mn: 0.8, Cr: 0.2, Si: 0.28 },
    postComposition: { C: 0.45, Mn: 0.9, Cr: 0.2, Si: 0.3 },
    outcome: "partial",
    costImpact: -89.5,
    recommendations: ["Ferro-Manganese 1.2kg", "Silicon 0.5kg"],
    confidence: 87,
  },
  {
    id: "D2024-003",
    timestamp: "2024-01-16 09:15:33",
    operator: "Mike Chen",
    batchId: "A2024-003",
    alloyGrade: "AISI 4340",
    preComposition: { C: 0.42, Mn: 0.7, Cr: 0.9, Si: 0.22 },
    postComposition: { C: 0.4, Mn: 0.8, Cr: 0.8, Si: 0.25 },
    outcome: "fail",
    costImpact: 234.0,
    recommendations: ["Ferro-Manganese 1.8kg", "Silicon 0.8kg"],
    confidence: 78,
  },
]

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [filterGrade, setFilterGrade] = useState("")
  const [filterOperator, setFilterOperator] = useState("")
  const [filterOutcome, setFilterOutcome] = useState("")

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "partial":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "fail":
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case "success":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "partial":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "fail":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getCompositionDiff = (pre: any, post: any, element: string) => {
    const diff = post[element] - pre[element]
    return {
      value: diff,
      icon: diff > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />,
      color: diff > 0 ? "text-green-400" : "text-red-400",
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-white">Decision History</h1>
            <p className="text-slate-400">Interactive timeline of AI recommendations and outcomes</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            PDF Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-slate-600 text-slate-300 justify-start bg-transparent">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Select value={filterGrade} onValueChange={setFilterGrade}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Alloy Grade" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="AISI 4140" className="text-white">
                  AISI 4140
                </SelectItem>
                <SelectItem value="AISI 1045" className="text-white">
                  AISI 1045
                </SelectItem>
                <SelectItem value="AISI 4340" className="text-white">
                  AISI 4340
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterOperator} onValueChange={setFilterOperator}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="John Doe" className="text-white">
                  John Doe
                </SelectItem>
                <SelectItem value="Sarah Wilson" className="text-white">
                  Sarah Wilson
                </SelectItem>
                <SelectItem value="Mike Chen" className="text-white">
                  Mike Chen
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterOutcome} onValueChange={setFilterOutcome}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Outcome" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="success" className="text-white">
                  Success
                </SelectItem>
                <SelectItem value="partial" className="text-white">
                  Partial
                </SelectItem>
                <SelectItem value="fail" className="text-white">
                  Failed
                </SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {decisionHistory.map((decision, index) => (
          <Card key={decision.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getOutcomeIcon(decision.outcome)}
                    <span className="text-white font-medium">{decision.id}</span>
                  </div>
                  <Badge variant="secondary" className={getOutcomeBadge(decision.outcome)}>
                    {decision.outcome.charAt(0).toUpperCase() + decision.outcome.slice(1)}
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {decision.alloyGrade}
                  </Badge>
                </div>
                <div className="text-right text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{decision.operator}</span>
                  </div>
                  <div>{decision.timestamp}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Pre/Post Composition */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Composition Changes</h4>
                  <div className="space-y-2">
                    {Object.keys(decision.preComposition).map((element) => {
                      const diff = getCompositionDiff(decision.preComposition, decision.postComposition, element)
                      return (
                        <div key={element} className="flex items-center justify-between p-2 rounded bg-slate-700/30">
                          <span className="text-slate-300 font-mono">{element}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400 text-sm">
                              {decision.preComposition[element as keyof typeof decision.preComposition]}%
                            </span>
                            <span className="text-slate-500">→</span>
                            <span className="text-white text-sm">
                              {decision.postComposition[element as keyof typeof decision.postComposition]}%
                            </span>
                            <div className={`flex items-center ${diff.color}`}>
                              {diff.icon}
                              <span className="text-xs ml-1">
                                {diff.value > 0 ? "+" : ""}
                                {diff.value.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium">AI Recommendations</h4>
                  <div className="space-y-2">
                    {decision.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-700/30 text-sm text-slate-300">
                        {rec}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="text-white font-mono">{decision.confidence}%</span>
                  </div>
                </div>

                {/* Cost Impact */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Impact Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Batch ID:</span>
                      <span className="text-white font-mono">{decision.batchId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cost Impact:</span>
                      <span className={`font-mono ${decision.costImpact < 0 ? "text-green-400" : "text-red-400"}`}>
                        {decision.costImpact < 0 ? "-" : "+"}${Math.abs(decision.costImpact).toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-700">
                      <Badge
                        variant="secondary"
                        className={`w-full justify-center ${getOutcomeBadge(decision.outcome)}`}
                      >
                        {decision.outcome === "success" && "Target Achieved"}
                        {decision.outcome === "partial" && "Partially Successful"}
                        {decision.outcome === "fail" && "Target Missed"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
