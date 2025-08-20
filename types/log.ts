import { ObjectId } from 'mongodb'

export interface ElementComposition {
  C: number
  Si: number
  Mn: number
  P: number
  S: number
  Cu: number
  Mg: number
}

export interface ElementAdjustment {
  element: string
  originalKg: number
  finalKg: number
  cost: number
  priority: string
}

export interface AnalysisLog {
  _id?: ObjectId
  id: string // Generated log ID (e.g., "LOG2025-001")
  timestamp: string
  operator: string
  operatorId: string // Clerk user ID
  batchId: string // Generated batch ID (e.g., "BATCH2025-001")
  alloyGrade: string
  furnaceId: string
  batchWeight: number
  preComposition: ElementComposition
  targetComposition: ElementComposition
  postComposition: ElementComposition // After AI + metallurgist adjustments
  elementAdjustments: ElementAdjustment[]
  totalAdditions: number // kg
  totalCost: number // INR
  costPerKg: number // INR per kg
  outcome: 'approved' | 'rejected' | 'pending'
  recommendations: string[]
  aiModelUsed: string
  modelPerformance: {
    accuracy: number
    r2Score: number
    elementsProcessed: number
  }
  metallurgistEdits: boolean
  editedElements: string[]
  confidence: number
  createdAt: Date
  updatedAt: Date
}

export interface LogFilters {
  operator?: string
  alloyGrade?: string
  batchId?: string
  outcome?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface LogStats {
  totalLogs: number
  approvedLogs: number
  rejectedLogs: number
  averageCost: number
  totalCostSavings: number
  mostUsedGrade: string
  topOperator: string
  averageConfidence: number
}