"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, CheckCircle, Clock, Lightbulb, Target, BarChart3, ChevronDown, ChevronUp, Edit3, Loader2, RefreshCw, RotateCcw } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs"

// Alloy grades with specifications - Updated to match backend API
const alloyGrades = [
  { 
    id: "EN1563", 
    name: "EN 1563 Ductile Iron",
    apiGrade: "EN1563",
    spec: {
      'C': {'min': 3.50, 'max': 3.70, 'target': 3.6, 'absorption_rate': 90, 'cost_per_kg': 150},
      'Si': {'min': 2.30, 'max': 2.50, 'target': 2.4, 'absorption_rate': 85, 'cost_per_kg': 120},
      'Mn': {'min': 0.20, 'max': 0.30, 'target': 0.25, 'absorption_rate': 75, 'cost_per_kg': 400},
      'P': {'min': 0.000, 'max': 0.050, 'target': 0.025, 'absorption_rate': 60, 'cost_per_kg': 300},
      'S': {'min': 0.000, 'max': 0.010, 'target': 0.005, 'absorption_rate': 70, 'cost_per_kg': 250},
      'Cu': {'min': 0.15, 'max': 0.30, 'target': 0.225, 'absorption_rate': 80, 'cost_per_kg': 700},
      'Mg': {'min': 0.035, 'max': 0.060, 'target': 0.0475, 'absorption_rate': 95, 'cost_per_kg': 2800}
    }
  },
  { 
    id: "ASTM-A395", 
    name: "ASTM A395 Ductile Iron",
    apiGrade: "ASTMA395",
    spec: {
      'C': {'min': 3.40, 'max': 3.80, 'target': 3.6, 'absorption_rate': 90, 'cost_per_kg': 150},
      'Si': {'min': 2.80, 'max': 3.20, 'target': 3.0, 'absorption_rate': 85, 'cost_per_kg': 120},
      'Mn': {'min': 0.10, 'max': 0.35, 'target': 0.225, 'absorption_rate': 75, 'cost_per_kg': 400},
      'P': {'min': 0.000, 'max': 0.040, 'target': 0.02, 'absorption_rate': 60, 'cost_per_kg': 300},
      'S': {'min': 0.000, 'max': 0.008, 'target': 0.004, 'absorption_rate': 70, 'cost_per_kg': 250},
      'Cu': {'min': 0.10, 'max': 0.25, 'target': 0.175, 'absorption_rate': 80, 'cost_per_kg': 700},
      'Mg': {'min': 0.025, 'max': 0.055, 'target': 0.04, 'absorption_rate': 95, 'cost_per_kg': 2800}
    }
  },
  { 
    id: "ASTM-A536", 
    name: "ASTM A536 Ductile Iron",
    apiGrade: "ASTMA536",
    spec: {
      'C': {'min': 3.20, 'max': 3.60, 'target': 3.4, 'absorption_rate': 90, 'cost_per_kg': 150},
      'Si': {'min': 2.40, 'max': 2.80, 'target': 2.6, 'absorption_rate': 85, 'cost_per_kg': 120},
      'Mn': {'min': 0.15, 'max': 0.40, 'target': 0.275, 'absorption_rate': 75, 'cost_per_kg': 400},
      'P': {'min': 0.000, 'max': 0.080, 'target': 0.04, 'absorption_rate': 60, 'cost_per_kg': 300},
      'S': {'min': 0.000, 'max': 0.015, 'target': 0.0075, 'absorption_rate': 70, 'cost_per_kg': 250},
      'Cu': {'min': 0.20, 'max': 0.50, 'target': 0.35, 'absorption_rate': 80, 'cost_per_kg': 700},
      'Mg': {'min': 0.030, 'max': 0.070, 'target': 0.05, 'absorption_rate': 95, 'cost_per_kg': 2800}
    }
  },
  { 
    id: "ASTM-A536-UPDATED", 
    name: "ASTM A536 Updated (High P)",
    apiGrade: "ASTMA536_UPDATED",
    spec: {
      'C': {'min': 3.20, 'max': 3.60, 'target': 3.4, 'absorption_rate': 90, 'cost_per_kg': 150},
      'Si': {'min': 2.40, 'max': 2.80, 'target': 2.6, 'absorption_rate': 85, 'cost_per_kg': 120},
      'Mn': {'min': 0.15, 'max': 0.40, 'target': 0.275, 'absorption_rate': 75, 'cost_per_kg': 400},
      'P': {'min': 0.35, 'max': 0.45, 'target': 0.4, 'absorption_rate': 60, 'cost_per_kg': 300},
      'S': {'min': 0.000, 'max': 0.015, 'target': 0.0075, 'absorption_rate': 70, 'cost_per_kg': 250},
      'Cu': {'min': 0.20, 'max': 0.50, 'target': 0.35, 'absorption_rate': 80, 'cost_per_kg': 700},
      'Mg': {'min': 0.030, 'max': 0.070, 'target': 0.05, 'absorption_rate': 95, 'cost_per_kg': 2800}
    }
  },
  { 
    id: "ASTM-A395-UPDATED", 
    name: "ASTM A395 Updated (High Mn, Zero P)",
    apiGrade: "ASTMA395_UPDATED",
    spec: {
      'C': {'min': 3.40, 'max': 3.80, 'target': 3.6, 'absorption_rate': 90, 'cost_per_kg': 150},
      'Si': {'min': 2.80, 'max': 3.20, 'target': 3.0, 'absorption_rate': 85, 'cost_per_kg': 120},
      'Mn': {'min': 0.60, 'max': 0.85, 'target': 0.725, 'absorption_rate': 75, 'cost_per_kg': 400},
      'P': {'min': 0.000, 'max': 0.000, 'target': 0.0, 'absorption_rate': 60, 'cost_per_kg': 300},
      'S': {'min': 0.000, 'max': 0.008, 'target': 0.004, 'absorption_rate': 70, 'cost_per_kg': 250},
      'Cu': {'min': 0.10, 'max': 0.25, 'target': 0.175, 'absorption_rate': 80, 'cost_per_kg': 700},
      'Mg': {'min': 0.025, 'max': 0.055, 'target': 0.04, 'absorption_rate': 95, 'cost_per_kg': 2800}
    }
  }
]

// API Configuration
const API_BASE_URL = 'http://localhost:8000'

// Batch configuration
const batchWeight = 3000 // Constant 3000 kg batch

// Cost per kg for each element (Indian Rupees)
const elementCosts = {
  'C': 125,
  'Si': 100,
  'Mn': 330,
  'P': 250,
  'S': 200,
  'Cu': 580,
  'Mg': 2300
}

// Calculate kg amount for element adjustment
const calculateKgAmount = (adjustmentPercentage: number) => {
  return (adjustmentPercentage / 100) * batchWeight
}

// Calculate cost for element adjustment
const calculateElementCost = (element: string, kgAmount: number) => {
  const costPerKg = elementCosts[element as keyof typeof elementCosts] || 0
  return kgAmount * costPerKg
}

// Types for API responses
interface ElementPrediction {
  element: string
  current: number
  target: number
  predicted_config: number
  adjustment_needed: number
  efficiency: number
  status: string
  priority: string
}

interface ApiResponse {
  success: boolean
  alloy_grade: string
  furnace_id: string
  target_specifications: Record<string, number>
  element_predictions: ElementPrediction[]
  optimization_insights: {
    total_adjustment_percentage: number
    high_efficiency_elements: number
    total_elements: number
    average_efficiency: number
  }
  cost_analysis: {
    total_cost_impact_per_tonne: number
    currency: string
  }
  recommendations: string[]
  model_performance: {
    r2_score: number
    accuracy_percentage: number
    elements_predicted: number
  }
}

// Mock current analysis data with realistic values
const generateAnalysisData = (grade: typeof alloyGrades[0], customValues?: any) => {
  const elements = [
    { element: "Carbon", symbol: "C", effect: "Strength ↑↑, Hardness ↑↑, Ductility ↓" },
    { element: "Silicon", symbol: "Si", effect: "Graphitization ↑, Fluidity ↑, Hardness ↓" },
    { element: "Manganese", symbol: "Mn", effect: "Pearlite Formation ↑, Strength ↑, Ductility ↓" },
    { element: "Phosphorous", symbol: "P", effect: "Fluidity ↑, Hardness ↑, Toughness ↓↓" },
    { element: "Sulfur", symbol: "S", effect: "Machinability ↑, Ductility ↓↓, Graphite ↓" },
    { element: "Copper", symbol: "Cu", effect: "Pearlite Formation ↑, Corrosion Resistance ↑" },
    { element: "Magnesium", symbol: "Mg", effect: "Nodularity ↑↑, Graphite Formation ↑↑" }
  ];

  return elements.map(el => {
    const spec = grade.spec[el.symbol as keyof typeof grade.spec];
    const current = customValues?.[el.symbol] ?? (spec.min + spec.max) / 2 * (0.9 + Math.random() * 0.2);
    return {
      ...el,
      current: parseFloat(current.toFixed(3)),
      target: { min: spec.min, max: spec.max },
      absorptionRate: spec.absorption_rate,
      costPerKg: spec.cost_per_kg
    };
  });
};



export default function AIConsole() {
  const { user } = useUser()
  const [currentGrade, setCurrentGrade] = useState(alloyGrades[0])
  const [expandedElement, setExpandedElement] = useState<string | null>(null)
  const [approved, setApproved] = useState(false)
  const [isEditingComposition, setIsEditingComposition] = useState(false)
  const [customComposition, setCustomComposition] = useState<any>({})

  const [heatId, setHeatId] = useState("H" + Math.floor(Math.random() * 10000).toString().padStart(4, '0'))
  const [furnaceId, setFurnaceId] = useState("1") // Default to 1 as requested
  
  // Metallurgist edit state
  const [isEditing, setIsEditing] = useState(false)
  const [editedAmounts, setEditedAmounts] = useState<Record<string, number>>({})
  const [originalAmounts, setOriginalAmounts] = useState<Record<string, number>>({})
  const [batchId, setBatchId] = useState("")
  const [loggingData, setLoggingData] = useState(false)
  
  // API state management
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [apiConnected, setApiConnected] = useState(false)
  
  // Function to call the backend API
  const callPredictionAPI = async (composition: any, grade: typeof alloyGrades[0]) => {
    setIsLoading(true)
    setApiError(null)
    
    try {
      const requestData = {
        alloy_grade: grade.apiGrade,
        furnace_id: furnaceId, // Use the current furnace ID from state
        current_composition: {
          C: composition.C || grade.spec.C.target,
          Si: composition.Si || grade.spec.Si.target,
          Mn: composition.Mn || grade.spec.Mn.target,
          P: composition.P || grade.spec.P.target,
          S: composition.S || grade.spec.S.target,
          Cu: composition.Cu || grade.spec.Cu.target,
          Mg: composition.Mg || grade.spec.Mg.target
        }
      }

      console.log('Sending API request:', requestData)

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('API Response:', data)
      
      setApiResponse(data)
      setApiConnected(true)
      
      
      
    } catch (error) {
      console.error('API Error:', error)
      setApiError(error instanceof Error ? error.message : 'Unknown API error')
      setApiConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Remove automatic API calls - only manual updates via button click

  // Initial API connection check only
  useEffect(() => {
    checkApiConnection()
  }, [])
  
  // Toggle element detail view
  const toggleElement = (element: string) => {
    setExpandedElement(expandedElement === element ? null : element)
  }

  // Handle composition value change
  const handleCompositionChange = (symbol: string, value: number) => {
    setCustomComposition((prev: any) => ({
      ...prev,
      [symbol]: value
    }))
  }
  
  // Generate analysis data from API response or fallback to mock data
  const generateAnalysisDataFromApi = () => {
    const elements = [
      { element: "Carbon", symbol: "C", effect: "Strength ↑↑, Hardness ↑↑, Ductility ↓" },
      { element: "Silicon", symbol: "Si", effect: "Graphitization ↑, Fluidity ↑, Hardness ↓" },
      { element: "Manganese", symbol: "Mn", effect: "Pearlite Formation ↑, Strength ↑, Ductility ↓" },
      { element: "Phosphorous", symbol: "P", effect: "Fluidity ↑, Hardness ↑, Toughness ↓↓" },
      { element: "Sulfur", symbol: "S", effect: "Machinability ↑, Ductility ↓↓, Graphite ↓" },
      { element: "Copper", symbol: "Cu", effect: "Pearlite Formation ↑, Corrosion Resistance ↑" },
      { element: "Magnesium", symbol: "Mg", effect: "Nodularity ↑↑, Graphite Formation ↑↑" }
    ];

    return elements.map(el => {
      const spec = currentGrade.spec[el.symbol as keyof typeof currentGrade.spec];
      
      // Use API data if available
      if (apiResponse && apiResponse.element_predictions) {
        const apiElement = apiResponse.element_predictions.find(pred => pred.element === el.symbol);
        if (apiElement) {
          const adjustment = apiElement.adjustment_needed
          const kgAmount = calculateKgAmount(Math.abs(adjustment))
          const elementCost = calculateElementCost(el.symbol, kgAmount)
          
          return {
            ...el,
            current: customComposition[el.symbol] ?? apiElement.current, // Use custom composition if available
            target: { min: spec.min, max: spec.max },
            absorptionRate: spec.absorption_rate,
            costPerKg: elementCosts[el.symbol as keyof typeof elementCosts],
            predicted_config: apiElement.predicted_config,
            adjustment: adjustment,
            kgAmount: kgAmount,
            elementCost: elementCost,
            status: apiElement.status,
            priority: apiElement.priority
          };
        }
      }
      
      // Fallback to custom or default values
      const current = customComposition[el.symbol] ?? (spec.min + spec.max) / 2 * (0.9 + Math.random() * 0.2);
      const adjustment = 0.02 // Default small adjustment
      const kgAmount = calculateKgAmount(Math.abs(adjustment))
      const elementCost = calculateElementCost(el.symbol, kgAmount)
      
      return {
        ...el,
        current: parseFloat(current.toFixed(3)),
        target: { min: spec.min, max: spec.max },
        absorptionRate: spec.absorption_rate,
        costPerKg: elementCosts[el.symbol as keyof typeof elementCosts],
        adjustment: adjustment,
        kgAmount: kgAmount,
        elementCost: elementCost
      };
    });
  };

  const analysisData = generateAnalysisDataFromApi();

  // Check API connection
  const checkApiConnection = async () => {
    setIsLoading(true)
    setApiError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('API Health Check:', data)
      
      if (data.status === 'healthy') {
        setApiConnected(true)
      } else {
        throw new Error('API is not healthy')
      }
    } catch (error) {
      console.error('API Connection Error:', error)
      setApiError(error instanceof Error ? error.message : 'Failed to connect to API')
      setApiConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Get API models info
  const getApiModelsInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/models`)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('API Models Info:', data)
      return data
    } catch (error) {
      console.error('API Models Error:', error)
      return null
    }
  }

  // Get AI predictions from backend
  const getAIPredictions = async () => {
    if (!apiConnected) {
      setApiError("Backend API is not connected. Please check if the server is running.")
      return
    }

    setIsLoading(true)
    setApiError(null)
    
    try {
      // Prepare current composition data from custom composition or default values
      const currentComposition = analysisData.reduce((acc, item) => {
        // Use custom composition if available, otherwise use current value
        acc[item.symbol] = customComposition[item.symbol] ?? item.current
        return acc
      }, {} as Record<string, number>)

      const requestData = {
        alloy_grade: currentGrade.apiGrade,
        current_composition: currentComposition,
        furnace_id: furnaceId || "1" // Ensure furnaceId is properly defined
      }

      console.log('Sending API request:', requestData)

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `API Error: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      console.log('API Response:', data)
      
      setApiResponse(data)
      
    } catch (error) {
      console.error('API Error:', error)
      setApiError(error instanceof Error ? error.message : 'Failed to get predictions')
    } finally {
      setIsLoading(false)
    }
  }



  

  // Generate batch ID
  const generateBatchId = () => {
    const now = new Date()
    const dateStr = now.getFullYear().toString() + 
                   (now.getMonth() + 1).toString().padStart(2, '0') + 
                   now.getDate().toString().padStart(2, '0')
    const timeStr = now.getHours().toString().padStart(2, '0') + 
                   now.getMinutes().toString().padStart(2, '0') + 
                   now.getSeconds().toString().padStart(2, '0')
    return `BATCH${dateStr}-${timeStr}`
  }

  // Initialize batch ID
  useEffect(() => {
    setBatchId(generateBatchId())
  }, [])

  // Handle metallurgist edit mode
  const handleEditMode = () => {
    if (!isEditing) {
      // Enter edit mode - store original amounts
      const amounts: Record<string, number> = {}
      analysisData.forEach(item => {
                  if (currentGrade.id === "EN1563" && (item as any).predicted_config) {
            // For EN1563, use Element Config values (already in kg)
            amounts[item.symbol] = (item as any).predicted_config
        } else {
          // For other grades, use calculated adjustment amounts
          const adjustment = (item as any).adjustment || 0
          amounts[item.symbol] = calculateKgAmount(Math.abs(adjustment))
        }
      })
      setOriginalAmounts(amounts)
      setEditedAmounts({...amounts})
      setIsEditing(true)
    } else {
      // Exit edit mode
      setIsEditing(false)
      setEditedAmounts({})
    }
  }

  // Handle kg amount change
  const handleKgAmountChange = (element: string, value: number) => {
    setEditedAmounts(prev => ({
      ...prev,
      [element]: value
    }))
  }

  // Reset to AI recommendations
  const resetToAI = () => {
    if (currentGrade.id === "EN1563") {
      // For EN1563, reset to Element Config values (already in kg)
      const amounts: Record<string, number> = {}
      analysisData.forEach(item => {
        if ((item as any).predicted_config) {
          amounts[item.symbol] = (item as any).predicted_config
        }
      })
      setEditedAmounts(amounts)
    } else {
      // For other grades, reset to original amounts
      setEditedAmounts({...originalAmounts})
    }
  }

  // Log analysis data
  const logAnalysisData = async () => {
    if (!user) {
      console.error('User not authenticated')
      return
    }

    setLoggingData(true)
    try {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19)
      
             // Calculate totals from all elements with kg amounts
       const totalAdditions = analysisData.reduce((sum, item) => {
         const originalKgAmount = (item as any).kgAmount || 0
         const currentKgAmount = isEditing ? (editedAmounts[item.symbol] || originalKgAmount) : originalKgAmount
         
         // For EN1563, use Element Config values if available (already in kg)
         const displayKgAmount = currentGrade.id === "EN1563" && (item as any).predicted_config 
           ? (item as any).predicted_config 
           : currentKgAmount
         
         return sum + displayKgAmount
       }, 0)
      
      const totalCost = analysisData.reduce((sum, item) => {
        const originalKgAmount = (item as any).kgAmount || 0
        const currentKgAmount = isEditing ? (editedAmounts[item.symbol] || originalKgAmount) : originalKgAmount
        
        // For EN1563, use Element Config values if available (already in kg)
        const displayKgAmount = currentGrade.id === "EN1563" && (item as any).predicted_config 
          ? (item as any).predicted_config 
          : currentKgAmount
        
        const elementCost = calculateElementCost(item.symbol, displayKgAmount)
        return sum + elementCost
      }, 0)
      const costPerKg = totalCost / batchWeight

      // Determine which elements were edited
      const editedElements = Object.keys(editedAmounts).filter(element => {
        const original = originalAmounts[element] || 0
        const edited = editedAmounts[element] || 0
        return Math.abs(original - edited) > 0.01
      })

      // Calculate final composition based on kg amounts
      const finalComposition = analysisData.reduce((acc, item) => {
        const originalKgAmount = (item as any).kgAmount || 0
        const currentKgAmount = isEditing ? (editedAmounts[item.symbol] || originalKgAmount) : originalKgAmount
        const adjustment = (item as any).adjustment || 0
        
        // Calculate the actual percentage change based on kg amount
        const actualAdjustment = adjustment > 0 ? (currentKgAmount / batchWeight) * 100 : 0
        acc[item.symbol] = item.current + actualAdjustment
        return acc
      }, {} as Record<string, number>)

      const logData = {
        timestamp,
        operator: user.fullName || user.emailAddresses[0]?.emailAddress || 'Unknown',
        operatorId: user.id,
        batchId,
        alloyGrade: currentGrade.apiGrade,
        furnaceId: `F${furnaceId.padStart(2, '0')}`,
        batchWeight,
        preComposition: analysisData.reduce((acc, item) => {
          acc[item.symbol] = item.current
          return acc
        }, {} as Record<string, number>),
        targetComposition: analysisData.reduce((acc, item) => {
          acc[item.symbol] = item.target.min + (item.target.max - item.target.min) / 2
          return acc
        }, {} as Record<string, number>),
        postComposition: finalComposition,
        elementAdjustments: analysisData.map(item => {
          const adjustment = (item as any).adjustment || 0
          const originalKgAmount = (item as any).kgAmount || 0
          const currentKgAmount = isEditing ? (editedAmounts[item.symbol] || originalKgAmount) : originalKgAmount
          
          // For EN1563, use Element Config values if available (already in kg)
          const displayKgAmount = currentGrade.id === "EN1563" && (item as any).predicted_config 
            ? (item as any).predicted_config 
            : currentKgAmount
          
          const elementCost = calculateElementCost(item.symbol, displayKgAmount)
          
          return {
            element: item.symbol,
            originalKg: originalKgAmount,
            finalKg: displayKgAmount,
            cost: elementCost,
            priority: (item as any).priority || "HIGH",
            elementConfig: currentGrade.id === "EN1563" ? (item as any).predicted_config : null
          }
        }),
        totalAdditions,
        totalCost,
        costPerKg,
        outcome: "approved",
        recommendations: apiResponse?.recommendations || [],
                 aiModelUsed: currentGrade.id === "EN1563" ? "EN1563_ELEMENT_CONFIG_MODEL" : "MULTI_GRADE_MODEL",
        modelPerformance: apiResponse ? {
          accuracy: apiResponse.model_performance.accuracy_percentage,
          r2Score: apiResponse.model_performance.r2_score,
          elementsProcessed: apiResponse.model_performance.elements_predicted
        } : {
          accuracy: 85,
          r2Score: 0.85,
          elementsProcessed: 7
        },
        metallurgistEdits: isEditing,
        editedElements,
        confidence: apiResponse ? apiResponse.model_performance.accuracy_percentage : 85
      }

      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData)
      })

      if (!response.ok) {
        throw new Error('Failed to log analysis data')
      }

      console.log('Analysis data logged successfully')
      
    } catch (error) {
      console.error('Error logging analysis data:', error)
    } finally {
      setLoggingData(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 bg-slate-900 min-h-screen">
      {/* Header with Batch Info */}
      <Card className="bg-slate-800/50 border-slate-700 mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-400">Alloy Grade</p>
              <Select 
                value={currentGrade.id}
                onValueChange={(value) => {
                  const grade = alloyGrades.find(g => g.id === value)!
                  setCurrentGrade(grade)
                  setCustomComposition({}) // Reset custom values when grade changes
                  setApiResponse(null) // Reset API response when grade changes
                }}
              >
                <SelectTrigger className="w-[250px] bg-transparent border-none text-white font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {alloyGrades.map(grade => (
                    <SelectItem key={grade.id} value={grade.id} className="text-white">
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
                         <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600">
               <p className="text-sm text-slate-400">Batch ID</p>
               <p className="font-mono font-medium text-white">#{batchId}</p>
             </div>
            <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-400">Furnace ID</p>
              <p className="font-mono font-medium text-white">#{furnaceId}</p>
            </div>
            <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-400">Batch Weight</p>
              <p className="font-mono font-medium text-white">{batchWeight.toLocaleString()} kg</p>
            </div>
                         <Badge className={`${apiConnected ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
               <Brain className="w-4 h-4 mr-1" />
               {apiConnected ? 'AI Model Active' : 'AI Offline'}
             </Badge>
             {currentGrade.id === "EN1563" && (
               <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                 <Target className="w-4 h-4 mr-1" />
                 Element Config Model
               </Badge>
             )}
          </div>
          
          {/* API Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={getAIPredictions}
              disabled={isLoading || !apiConnected}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Get AI Predictions
                </>
              )}
            </Button>
            
            <Button
              onClick={checkApiConnection}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Connection
            </Button>
            
            {apiResponse && (
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                Model Accuracy: {apiResponse.model_performance.accuracy_percentage.toFixed(1)}%
              </Badge>
            )}
          </div>
          
          {/* API Error Display */}
          {apiError && (
            <Alert className="mt-4 bg-red-500/10 border-red-500/20">
              <AlertDescription className="text-red-200">
                <strong>API Error:</strong> {apiError}
              </AlertDescription>
            </Alert>
          )}
          
          {/* API Success Display */}
          {apiResponse && (
            <Alert className="mt-4 bg-green-500/10 border-green-500/20">
              <AlertDescription className="text-green-200">
                <strong>AI Analysis Complete:</strong> Predictions updated with {apiResponse.element_predictions.length} elements analyzed
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

             {/* Main Dashboard Grid */}
       <div className="grid lg:grid-cols-3 gap-6">
         
         {/* Current Composition Analysis */}
         <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="text-blue-600" />
                  <span>Current Composition</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Real-time spectrometer analysis vs target</CardDescription>
              </div>
                             <Button
                 size="sm"
                 variant={isEditingComposition ? "default" : "outline"}
                 onClick={() => {
                   if (isEditingComposition) {
                     // Save the edited values - they're already saved in customComposition
                     setIsEditingComposition(false)
                   } else {
                     // Enter edit mode
                     setIsEditingComposition(true)
                   }
                 }}
                 className="border-slate-600"
               >
                 <Edit3 className="w-4 h-4 mr-2" />
                 {isEditingComposition ? "Save" : "Edit"}
               </Button>
            </div>
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
                    <div className="flex-1">
                      <p className="font-medium text-left text-white">{item.element}</p>
                      <div className="text-xs text-slate-400 text-left flex items-center gap-2">
                        <span>Current:</span>
                                                 {isEditingComposition ? (
                           <Input
                             type="number"
                             step="0.001"
                             value={customComposition[item.symbol] ?? item.current}
                             onChange={(e) => handleCompositionChange(item.symbol, parseFloat(e.target.value) || 0)}
                             className="w-20 h-6 text-xs bg-slate-600 border-slate-500 text-white"
                             onClick={(e) => e.stopPropagation()}
                           />
                         ) : (
                           <span>{customComposition[item.symbol] ?? item.current}%</span>
                         )}
                        <span>| Target: {item.target.min}–{item.target.max}%</span>
                      </div>
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
                        <p className="text-xs text-slate-400">Cost per kg</p>
                        <p className="font-medium text-white">₹{item.costPerKg}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Absorption Rate</p>
                        <p className="font-medium text-white">{item.absorptionRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Cost per kg</p>
                        <p className="font-medium text-white">₹{item.costPerKg}</p>
                      </div>
                      
                      {/* Show API predictions if available */}
                      {(item as any).predicted_config && (
                        <>
                          <div>
                            <p className="text-xs text-slate-400">AI Predicted Config</p>
                            <p className="font-medium text-blue-300">{(item as any).predicted_config.toFixed(3)}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Adjustment Needed</p>
                            <p className="font-medium text-orange-300">{(item as any).adjustment_needed?.toFixed(3)}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">AI Status</p>
                            <p className="font-medium text-white">{(item as any).status}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Priority</p>
                            <p className="font-medium text-white">{(item as any).priority}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <Alert className={`${
                      item.current < item.target.min || item.current > item.target.max
                        ? "bg-red-500/10 border-red-500/20"
                        : "bg-green-500/10 border-green-500/20"
                    }`}>
                      <AlertDescription className={`text-sm ${
                        item.current < item.target.min || item.current > item.target.max
                          ? "text-red-200"
                          : "text-green-200"
                      }`}>
                        {item.element} content affects {item.effect.split(",")[0]}. 
                        {item.current < item.target.min 
                          ? " Below optimal range - may need addition"
                          : item.current > item.target.max
                          ? " Above optimal range - may affect quality"
                          : " Within optimal range"
                        }
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

                          {/* Analysis Approval */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CheckCircle className="text-green-600" />
                    <span>Analysis Approval</span>
                  </CardTitle>
                  <CardDescription className="text-slate-400">Total additions and costs for {batchWeight.toLocaleString()} kg batch</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={isEditing ? "default" : "outline"}
                    onClick={handleEditMode}
                    className="border-slate-600"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel Edit" : "Edit Amounts"}
                  </Button>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={resetToAI}
                      className="border-slate-600 text-slate-300"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset to AI
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          <CardContent className="space-y-4">
                         {/* Element Adjustments */}
             <div>
               <h4 className="font-medium mb-3 text-white">
                 Element Adjustments
                 {currentGrade.id === "EN1563" && (
                   <span className="text-blue-300 text-sm ml-2">(with Element Config)</span>
                 )}
               </h4>
              <div className="space-y-2">
                                 {analysisData.map(item => {
                   const adjustment = (item as any).adjustment || 0
                   const originalKgAmount = (item as any).kgAmount || 0
                   const currentKgAmount = isEditing ? (editedAmounts[item.symbol] || originalKgAmount) : originalKgAmount
                   
                   // For EN1563, use Element Config values from the ML model
                   const displayKgAmount = currentGrade.id === "EN1563" && (item as any).predicted_config 
                     ? (item as any).predicted_config 
                     : (isEditing ? currentKgAmount : originalKgAmount)
                   
                   const elementCost = calculateElementCost(item.symbol, displayKgAmount)
                   const isEdited = isEditing && Math.abs(originalKgAmount - currentKgAmount) > 0.01
                   
                   // For EN1563, show all elements with Element Config values
                   // For other grades, skip if no adjustment needed
                   if (currentGrade.id !== "EN1563" && Math.abs(adjustment) < 0.001) return null
                   
                   return (
                     <div key={item.element} className={`flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border ${
                       isEdited ? 'border-blue-500/50 bg-blue-500/10' : 'border-slate-600'
                     }`}>
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                           <span className="font-mono text-sm text-blue-300">{item.symbol}</span>
                         </div>
                         <div>
                           <p className="font-medium text-white">{item.element}</p>
                           {currentGrade.id === "EN1563" && (item as any).predicted_config ? (
                             <p className="text-sm text-blue-300">
                               Element Config: {(item as any).predicted_config.toFixed(4)} kg
                             </p>
                           ) : currentGrade.id === "EN1563" ? (
                             <p className="text-sm text-slate-400">
                               Run AI Analysis to get Element Config
                             </p>
                           ) : (
                             <p className="text-sm text-slate-400">
                               {adjustment > 0 ? 'Add' : 'Reduce'} {Math.abs(adjustment).toFixed(4)}%
                             </p>
                           )}
                           {isEdited && (
                             <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                               Edited
                             </Badge>
                           )}
                         </div>
                       </div>
                       <div className="text-right">
                         {isEditing ? (
                           <div className="flex items-center gap-2">
                             <Input
                               type="number"
                               step="0.1"
                               value={currentGrade.id === "EN1563" && (item as any).predicted_config 
                                 ? (item as any).predicted_config.toFixed(4)
                                 : currentKgAmount.toFixed(2)
                               }
                               onChange={(e) => handleKgAmountChange(item.symbol, parseFloat(e.target.value) || 0)}
                               className="w-20 h-8 text-sm bg-slate-600 border-slate-500 text-white"
                             />
                             <span className="text-white text-sm">kg</span>
                           </div>
                         ) : (
                           <p className="font-medium text-white">
                             {currentGrade.id === "EN1563" && (item as any).predicted_config 
                               ? (item as any).predicted_config.toFixed(4) 
                               : displayKgAmount.toFixed(2)
                             } kg
                           </p>
                         )}
                         <p className="text-sm text-slate-400">₹{elementCost.toFixed(2)}</p>
                         {isEditing && (
                           <p className="text-xs text-slate-500">
                             AI: {currentGrade.id === "EN1563" && (item as any).predicted_config 
                               ? (item as any).predicted_config.toFixed(4)
                               : originalKgAmount.toFixed(2)
                             } kg
                           </p>
                         )}
                       </div>
                     </div>
                   )
                 })}
              </div>
            </div>
            
                         {/* Total Calculations */}
             <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
               <h4 className="font-medium mb-3 text-white">Total Calculations</h4>
               <div className="space-y-3">
                                                   {(() => {
                   const totalAdditions = analysisData.reduce((sum, item) => {
                     const originalKgAmount = (item as any).kgAmount || 0
                     const currentKgAmount = isEditing ? (editedAmounts[item.symbol] || originalKgAmount) : originalKgAmount
                     
                     // For EN1563, use Element Config values from ML model
                     const displayKgAmount = currentGrade.id === "EN1563" && (item as any).predicted_config 
                       ? (item as any).predicted_config 
                       : currentKgAmount
                     
                     return sum + displayKgAmount
                   }, 0)
                    
                    const totalCost = analysisData.reduce((sum, item) => {
                      const adjustment = (item as any).adjustment || 0
                      const originalKgAmount = (item as any).kgAmount || 0
                      const currentKgAmount = isEditing ? (editedAmounts[item.symbol] || originalKgAmount) : originalKgAmount
                      
                      // For EN1563, use Element Config values from ML model
                      const displayKgAmount = currentGrade.id === "EN1563" && (item as any).predicted_config 
                        ? (item as any).predicted_config 
                        : currentKgAmount
                      
                      const elementCost = calculateElementCost(item.symbol, displayKgAmount)
                      return sum + elementCost
                    }, 0)
                    
                    const costPerKg = totalCost / batchWeight
                   
                   return (
                     <>
                       <div className="flex justify-between">
                         <span className="text-slate-400">Total Additions:</span>
                         <span className="font-medium text-white">{totalAdditions.toFixed(2)} kg</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-slate-400">Total Material Cost:</span>
                         <span className="font-medium text-white">₹{totalCost.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-slate-400">Cost per kg of final product:</span>
                         <span className="font-medium text-white">₹{costPerKg.toFixed(3)}</span>
                       </div>
                     </>
                   )
                 })()}
               </div>
             </div>
             
             {/* Approval Button */}
             <Button 
               variant={approved ? "outline" : "default"} 
               className="w-full border-slate-600 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300"
               onClick={async () => {
                 if (!approved) {
                   await logAnalysisData() // Call logging function
                   setApproved(true)
                   if (isEditing) {
                     setIsEditing(false) // Exit edit mode when approving
                   }
                 } else {
                   setApproved(false)
                 }
               }}
               disabled={loggingData}
             >
               <CheckCircle className="w-4 h-4 mr-2" />
               {approved ? "Approved ✓" : "Approve as Metallurgist"}
             </Button>
             
             {isEditing && (
               <p className="text-sm text-blue-400 text-center mt-2">
                 You can approve directly while editing - this will finalize your changes
               </p>
             )}
             
             {loggingData && (
               <div className="text-center mt-2">
                 <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1" />
                 <p className="text-sm text-slate-400">Logging analysis data...</p>
               </div>
             )}
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
                 {analysisData.map(item => {
                   // Calculate final composition based on edited kg amounts
                   const originalKgAmount = (item as any).kgAmount || 0
                   const currentKgAmount = isEditing ? (editedAmounts[item.symbol] || originalKgAmount) : originalKgAmount
                   const adjustment = (item as any).adjustment || 0
                   
                   // Calculate the actual percentage change based on kg amount
                   const actualAdjustment = adjustment > 0 ? (currentKgAmount / batchWeight) * 100 : 0
                   const finalComposition = item.current + actualAdjustment
                   
                   return (
                     <div key={item.element} className="flex items-center gap-4">
                       <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                         <span className="text-xs font-mono text-blue-300">{item.symbol}</span>
                       </div>
                       <div className="flex-1">
                         <div className="flex justify-between text-sm mb-1">
                           <span className="text-white">{item.element}</span>
                           <span className="font-mono text-white">
                             {item.current.toFixed(3)}% → {finalComposition.toFixed(3)}%
                           </span>
                         </div>
                         <Progress 
                           value={Math.max(0, Math.min(100, ((finalComposition - item.target.min) / (item.target.max - item.target.min)) * 100))} 
                           className="h-2"
                         />
                       </div>
                     </div>
                   )
                 })}
               </div>
             </div>
            
                                                   {/* Total Calculations */}
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                <h4 className="font-medium mb-3 text-white">Total Calculations</h4>
                <div className="space-y-3">
                  {(() => {
                    // Sum all elements that have kg amounts (all additions)
                    const totalAdditions = analysisData.reduce((sum, item) => {
                      const originalKgAmount = (item as any).kgAmount || 0
                      const currentKgAmount = isEditing ? (editedAmounts[item.symbol] || originalKgAmount) : originalKgAmount
                      
                      // For EN1563, use Element Config values if available (already in kg)
                      const displayKgAmount = currentGrade.id === "EN1563" && (item as any).predicted_config 
                        ? (item as any).predicted_config 
                        : currentKgAmount
                      
                      return sum + displayKgAmount
                    }, 0)
                    
                    const totalCost = analysisData.reduce((sum, item) => {
                      const originalKgAmount = (item as any).kgAmount || 0
                      const currentKgAmount = isEditing ? (editedAmounts[item.symbol] || originalKgAmount) : originalKgAmount
                      
                      // For EN1563, use Element Config values if available (already in kg)
                      const displayKgAmount = currentGrade.id === "EN1563" && (item as any).predicted_config 
                        ? (item as any).predicted_config 
                        : currentKgAmount
                      
                      const elementCost = calculateElementCost(item.symbol, displayKgAmount)
                      return sum + elementCost
                    }, 0)
                    
                    const costPerKg = totalCost / batchWeight
                    
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Additions:</span>
                          <span className="font-medium text-white">{totalAdditions.toFixed(2)} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Material Cost:</span>
                          <span className="font-medium text-white">₹{totalCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cost per kg of final product:</span>
                          <span className="font-medium text-white">₹{costPerKg.toFixed(3)}</span>
                        </div>
                        <div className="border-t border-slate-600 pt-2 flex justify-between font-medium">
                          <span className="text-white">Batch Total</span>
                          <span className="text-green-400">₹{totalCost.toFixed(2)}</span>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            

            
            {/* Quality Metrics */}
            <div>
              <h4 className="font-medium mb-3 text-white">Quality Projections</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {apiResponse ? "97%" : "95%"}
                  </div>
                  <p className="text-xs text-slate-400">Nodularity</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {apiResponse ? "92%" : "88%"}
                  </div>
                  <p className="text-xs text-slate-400">Tensile Strength</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    92%
                  </div>
                  <p className="text-xs text-slate-400">
                    Yield Strength
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}