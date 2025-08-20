import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { LogStats } from '@/types/log'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const client = await clientPromise
    const db = client.db('AlloyMindAI')
    const collection = db.collection('Logs')

    // Build date filter
    const dateFilter: any = {}
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {}
      if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom)
      if (dateTo) dateFilter.createdAt.$lte = new Date(dateTo)
    }

    // Aggregate statistics
    const [
      totalStats,
      outcomeStats,
      costStats,
      gradeStats,
      operatorStats,
      confidenceStats
    ] = await Promise.all([
      // Total logs count
      collection.countDocuments(dateFilter),
      
      // Outcome distribution
      collection.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$outcome', count: { $sum: 1 } } }
      ]).toArray(),
      
      // Cost statistics
      collection.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            averageCost: { $avg: '$totalCost' },
            totalCostSavings: { $sum: '$totalCost' },
            minCost: { $min: '$totalCost' },
            maxCost: { $max: '$totalCost' }
          }
        }
      ]).toArray(),
      
      // Most used alloy grade
      collection.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$alloyGrade', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]).toArray(),
      
      // Top operator by log count
      collection.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$operator', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]).toArray(),
      
      // Average confidence
      collection.aggregate([
        { $match: dateFilter },
        { $group: { _id: null, averageConfidence: { $avg: '$confidence' } } }
      ]).toArray()
    ])

    // Process outcome stats
    const approvedLogs = outcomeStats.find(stat => stat._id === 'approved')?.count || 0
    const rejectedLogs = outcomeStats.find(stat => stat._id === 'rejected')?.count || 0

    const stats: LogStats = {
      totalLogs: totalStats,
      approvedLogs,
      rejectedLogs,
      averageCost: costStats[0]?.averageCost || 0,
      totalCostSavings: Math.abs(costStats[0]?.totalCostSavings || 0), // Make positive for savings
      mostUsedGrade: gradeStats[0]?._id || 'N/A',
      topOperator: operatorStats[0]?._id || 'N/A',
      averageConfidence: confidenceStats[0]?.averageConfidence || 0
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching log stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}