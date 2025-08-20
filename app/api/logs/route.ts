import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { AnalysisLog, LogFilters } from '@/types/log'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters: LogFilters = {
      operator: searchParams.get('operator') || undefined,
      alloyGrade: searchParams.get('alloyGrade') || undefined,
      batchId: searchParams.get('batchId') || undefined,
      outcome: searchParams.get('outcome') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20')
    }

    const client = await clientPromise
    const db = client.db('AlloyMindAI')
    const collection = db.collection('Logs')

    // Build query
    const query: any = {}
    
    if (filters.operator) {
      query.operator = { $regex: filters.operator, $options: 'i' }
    }
    
    if (filters.alloyGrade) {
      query.alloyGrade = filters.alloyGrade
    }
    
    if (filters.batchId) {
      query.batchId = { $regex: filters.batchId, $options: 'i' }
    }
    
    if (filters.outcome) {
      query.outcome = filters.outcome
    }
    
    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {}
      if (filters.dateFrom) {
        query.createdAt.$gte = new Date(filters.dateFrom)
      }
      if (filters.dateTo) {
        query.createdAt.$lte = new Date(filters.dateTo)
      }
    }

    const skip = ((filters.page || 1) - 1) * (filters.limit || 20)
    
    const [logs, totalCount] = await Promise.all([
      collection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(filters.limit || 20)
        .toArray(),
      collection.countDocuments(query)
    ])

    return NextResponse.json({
      logs,
      pagination: {
        total: totalCount,
        page: filters.page || 1,
        limit: filters.limit || 20,
        pages: Math.ceil(totalCount / (filters.limit || 20))
      }
    })

  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const logData: Omit<AnalysisLog, '_id' | 'createdAt' | 'updatedAt'> = await request.json()

    // Generate unique log ID
    const client = await clientPromise
    const db = client.db('AlloyMindAI')
    const collection = db.collection('Logs')
    
    // Get the latest log to generate next ID
    const latestLog = await collection.findOne({}, { sort: { createdAt: -1 } })
    const currentYear = new Date().getFullYear()
    
    let nextNumber = 1
    if (latestLog && latestLog.id) {
      const match = latestLog.id.match(/LOG(\d{4})-(\d{3})/)
      if (match && parseInt(match[1]) === currentYear) {
        nextNumber = parseInt(match[2]) + 1
      }
    }
    
    const logId = `LOG${currentYear}-${nextNumber.toString().padStart(3, '0')}`

    const newLog: AnalysisLog = {
      ...logData,
      id: logId,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(newLog)

    return NextResponse.json({
      success: true,
      logId: result.insertedId,
      generatedId: logId
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating log:', error)
    return NextResponse.json(
      { error: 'Failed to create log' },
      { status: 500 }
    )
  }
}