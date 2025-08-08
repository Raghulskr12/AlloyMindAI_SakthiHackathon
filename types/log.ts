// Log entry interface for decision history
export interface LogEntry {
  _id?: string;
  id: string;
  timestamp: Date | string;
  operator: string;
  batchId: string;
  alloyGrade: string;
  preComposition: {
    [element: string]: number;
  };
  postComposition: {
    [element: string]: number;
  };
  outcome: 'success' | 'failure' | 'partial' | 'pending';
  costImpact: number; // Negative values indicate savings
  recommendations: string[];
  confidence: number; // 0-100
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Statistics interface for dashboard metrics
export interface LogStatistics {
  summary: {
    totalLogs: number;
    successCount: number;
    failureCount: number;
    successRate: number;
    avgConfidence: number;
    totalCostSavings: number;
  };
  topAlloyGrades: {
    alloyGrade: string;
    count: number;
  }[];
  recentLogs: LogEntry[];
}

// Filter options interface
export interface LogFilters {
  alloyGrades: string[];
  operators: string[];
  outcomes: string[];
}

// Pagination interface
export interface LogPagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// API response interfaces
export interface LogsResponse {
  logs: LogEntry[];
  pagination: LogPagination;
}

export interface BulkOperationResponse {
  message: string;
  insertedCount?: number;
  deletedCount?: number;
  insertedIds?: Record<number, any>;
}

export interface ExportResponse {
  data: LogEntry[];
  count: number;
  exportedAt: string;
}
