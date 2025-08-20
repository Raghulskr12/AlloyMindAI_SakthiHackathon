"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import {
  Download,
  Filter,
  CalendarIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
} from "lucide-react"
import { format } from "date-fns"
import { AnalysisLog, LogFilters } from "@/types/log"
import { LogService } from "@/lib/services/log-service"

export default function HistoryPage() {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [filterGrade, setFilterGrade] = useState("all")
  const [filterOperator, setFilterOperator] = useState("all")
  const [filterOutcome, setFilterOutcome] = useState("all")
  const [decisionHistory, setDecisionHistory] = useState<AnalysisLog[]>([])
  const [availableGrades, setAvailableGrades] = useState<string[]>([])
  const [availableOperators, setAvailableOperators] = useState<string[]>([])
  const [availableOutcomes] = useState<string[]>(["approved", "rejected", "pending"])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch logs from API
  useEffect(() => {
    fetchLogs()
  }, [])

  // Fetch logs when filters change
  useEffect(() => {
    fetchLogs()
  }, [selectedDate, filterGrade, filterOperator, filterOutcome])

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const filters: any = {}
      if (filterGrade && filterGrade !== 'all') filters.alloyGrade = filterGrade
      if (filterOperator && filterOperator !== 'all') filters.operator = filterOperator
      if (filterOutcome && filterOutcome !== 'all') filters.outcome = filterOutcome
      if (selectedDate) {
        filters.dateFrom = selectedDate.toISOString().split('T')[0]
        filters.dateTo = selectedDate.toISOString().split('T')[0]
      }
      
      const data = await LogService.getLogs(filters)
      setDecisionHistory(data.logs || [])
      
      // Extract unique values for filter dropdowns
      const grades = [...new Set(data.logs.map(log => log.alloyGrade))]
      const operators = [...new Set(data.logs.map(log => log.operator))]
      setAvailableGrades(grades)
      setAvailableOperators(operators)
      
    } catch (err) {
      setError('Error loading decision logs')
      console.error(err)
      toast({
        title: "Error",
        description: "Could not load decision logs. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = async (format: 'csv' | 'json') => {
    try {
      const logIds = decisionHistory.map(log => log.id)
      const result = await LogService.bulkOperation('export', logIds)
      
      const filename = `analysis_logs_${new Date().toISOString().split('T')[0]}`
      
      if (format === 'csv') {
        // Convert to CSV
        const csvData = convertToCSV(result.logs)
        const blob = new Blob([csvData], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        const blob = new Blob([JSON.stringify(result.logs, null, 2)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.json`
        a.click()
        window.URL.revokeObjectURL(url)
      }
      
      toast({
        title: "Success",
        description: `Data exported successfully as ${format.toUpperCase()}`,
      })
    } catch (err) {
      console.error('Error exporting data:', err)
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      })
    }
  }

  const convertToCSV = (logs: AnalysisLog[]) => {
    const headers = [
      'ID', 'Timestamp', 'Operator', 'Batch ID', 'Alloy Grade', 'Furnace ID',
      'Total Cost (₹)', 'Total Additions (kg)', 'Outcome', 'Confidence', 'Model Used'
    ]
    
    const rows = logs.map(log => [
      log.id,
      log.timestamp,
      log.operator,
      log.batchId,
      log.alloyGrade,
      log.furnaceId,
      log.totalCost.toFixed(2),
      log.totalAdditions.toFixed(2),
      log.outcome,
      log.confidence,
      log.aiModelUsed
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  const clearFilters = () => {
    setSelectedDate(undefined)
    setFilterGrade("all")
    setFilterOperator("all")
    setFilterOutcome("all")
  }

  // Filter decisions locally for display (API already handles most filters)
  const filteredDecisions = decisionHistory

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
      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="border-slate-600 text-slate-300 bg-transparent"
                onClick={() => exportData('csv')}
                disabled={isLoading}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                variant="outline" 
                className="border-slate-600 text-slate-300 bg-transparent"
                onClick={() => exportData('json')}
                disabled={isLoading}
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-6 gap-4">
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
                <SelectItem value="all" className="text-white">All Grades</SelectItem>
                {availableGrades.map((grade: string) => (
                  <SelectItem key={grade} value={grade} className="text-white">
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterOperator} onValueChange={setFilterOperator}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">All Operators</SelectItem>
                {availableOperators.map((operator: string) => (
                  <SelectItem key={operator} value={operator} className="text-white">
                    {operator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterOutcome} onValueChange={setFilterOutcome}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Outcome" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">All Outcomes</SelectItem>
                {availableOutcomes.map((outcome: string) => (
                  <SelectItem key={outcome} value={outcome} className="text-white">
                    <Badge variant={outcome === 'approved' ? 'default' : outcome === 'pending' ? 'secondary' : 'destructive'}>
                      {outcome}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-slate-600 text-slate-300 bg-transparent" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span className="text-white">Loading decision history...</span>
          </div>
        </div>
      ) : filteredDecisions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400">No decision logs found for the selected filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDecisions.map((decision: AnalysisLog, index: number) => (
            <Card key={decision._id?.toString() || decision.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white font-medium">{decision.batchId}</span>
                    </div>
                    <Badge variant="secondary" className={`${
                      decision.outcome === 'approved' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : decision.outcome === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {decision.outcome === 'approved' ? 'Approved' : decision.outcome}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                      {decision.alloyGrade}
                    </Badge>
                    {decision.metallurgistEdits && (
                      <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                        Edited by Metallurgist
                      </Badge>
                    )}
                  </div>
                  <div className="text-right text-sm text-slate-400">
                    <div>{decision.timestamp}</div>
                    <div>Operator: {decision.operator}</div>
                    <div>Furnace: {decision.furnaceId}</div>
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
                                {decision.preComposition[element as keyof typeof decision.preComposition].toFixed(3)}%
                              </span>
                              <span className="text-slate-500">→</span>
                              <span className="text-white text-sm">
                                {decision.postComposition[element as keyof typeof decision.postComposition].toFixed(3)}%
                              </span>
                              <div className={`flex items-center ${diff.color}`}>
                                {diff.icon}
                                <span className="text-xs ml-1">
                                  {diff.value > 0 ? "+" : ""}
                                  {diff.value.toFixed(3)}
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
                    {decision.recommendations.map((rec: string, idx: number) => (
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
                  <h4 className="text-white font-medium">Cost Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Batch Weight:</span>
                      <span className="text-white font-mono">{decision.batchWeight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Additions:</span>
                      <span className="text-white font-mono">{decision.totalAdditions.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Cost:</span>
                      <span className="text-white font-mono">₹{decision.totalCost.toFixed(2)}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">AI Model:</span>
                        <span className="text-blue-400 text-sm">{decision.aiModelUsed}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="text-green-400 font-mono">{decision.confidence}%</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Badge
                        variant="secondary"
                        className="w-full justify-center bg-blue-500/10 text-blue-400 border-blue-500/20"
                      >
                        Material Cost: ₹{decision.totalCost.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
    </div>
  )
}
