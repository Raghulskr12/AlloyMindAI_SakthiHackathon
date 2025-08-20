import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('AlloyMindAI')
    const collection = db.collection('Logs')

    // Get the last 30 days of data
    const now = new Date()
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      currentBatch,
      batchHistory,
      monthlyTrends,
      elementStats
    ] = await Promise.all([
      // Get current batch (most recent)
      collection.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: now } } },
        { $sort: { createdAt: -1 } },
        { $limit: 1 },
        {
          $project: {
            batchId: 1,
            alloyGrade: 1,
            preComposition: 1,
            targetComposition: 1,
            postComposition: 1,
            elementAdjustments: 1,
            totalCost: 1,
            totalAdditions: 1,
            confidence: 1,
            outcome: 1,
            createdAt: 1
          }
        }
      ]).toArray(),

      // Get recent batch history (last 4 batches)
      collection.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: now } } },
        { $sort: { createdAt: -1 } },
        { $limit: 4 },
        {
          $project: {
            batchId: 1,
            createdAt: 1,
            preComposition: 1,
            totalCost: 1,
            totalAdditions: 1,
            confidence: 1,
            outcome: 1
          }
        }
      ]).toArray(),

      // Get monthly trends (last 4 months)
      collection.aggregate([
        { $match: { createdAt: { $gte: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000), $lte: now } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            avgPreComposition: {
              $avg: {
                $mergeObjects: [
                  '$preComposition',
                  { avgCost: { $avg: '$totalCost' } }
                ]
              }
            },
            avgCost: { $avg: '$totalCost' },
            totalBatches: { $sum: 1 },
            avgConfidence: { $avg: '$confidence' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 4 }
      ]).toArray(),

      // Get element statistics
      collection.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: now } } },
        { $unwind: '$elementAdjustments' },
        {
          $group: {
            _id: '$elementAdjustments.element',
            avgOriginalKg: { $avg: '$elementAdjustments.originalKg' },
            avgFinalKg: { $avg: '$elementAdjustments.finalKg' },
            avgCost: { $avg: '$elementAdjustments.cost' },
            totalCost: { $sum: '$elementAdjustments.cost' },
            usageCount: { $sum: 1 },
            editRate: {
              $avg: {
                $cond: [
                  { $ne: ['$elementAdjustments.originalKg', '$elementAdjustments.finalKg'] },
                  100,
                  0
                ]
              }
            }
          }
        },
        { $sort: { totalCost: -1 } }
      ]).toArray()
    ])

    // Process current batch data
    const current = currentBatch[0]
    let elements = []
    
    if (current) {
      const elementSymbols = ['Fe', 'C', 'Mn', 'Si', 'Cr', 'Ni']
      const elementNames = ['Iron', 'Carbon', 'Manganese', 'Silicon', 'Chromium', 'Nickel']
      const costPerKg = [41.5, 99.6, 207.5, 257.3, 722.1, 1029.2]
      
      elements = elementSymbols.map((symbol, index) => {
        const preValue = current.preComposition[symbol] || 0
        const targetValue = current.targetComposition[symbol] || 0
        const postValue = current.postComposition[symbol] || 0
        
        // Calculate trend based on current vs target
        let trend = 'stable'
        if (Math.abs(preValue - targetValue) > 0.01) {
          trend = preValue < targetValue ? 'up' : 'down'
        }
        
        // Calculate min/max ranges (target ± 10%)
        const min = targetValue * 0.9
        const max = targetValue * 1.1
        
        return {
          symbol,
          name: elementNames[index],
          current: Math.round(preValue * 1000) / 1000,
          target: Math.round(targetValue * 1000) / 1000,
          min: Math.round(min * 1000) / 1000,
          max: Math.round(max * 1000) / 1000,
          trend,
          costPerKg: costPerKg[index]
        }
      })
    }

    // Process batch history
    const history = batchHistory.map(batch => {
      const batchDate = new Date(batch.createdAt)
      return {
        batch: batch.batchId,
        date: batchDate.toISOString().split('T')[0],
        Fe: Math.round((batch.preComposition?.Fe || 85) * 10) / 10,
        C: Math.round((batch.preComposition?.C || 0.4) * 1000) / 1000,
        Mn: Math.round((batch.preComposition?.Mn || 1.2) * 1000) / 1000,
        Si: Math.round((batch.preComposition?.Si || 0.25) * 1000) / 1000,
        Cr: Math.round((batch.preComposition?.Cr || 0.8) * 1000) / 1000,
        Ni: Math.round((batch.preComposition?.Ni || 0.3) * 1000) / 1000,
        cost: Math.round(batch.totalCost * 100) / 100,
        time: Math.round(batch.confidence * 0.2) // Convert confidence to time estimate
      }
    })

    // Process monthly trends
    const trends = monthlyTrends.map(item => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthName = monthNames[item._id.month - 1]
      
      return {
        month: monthName,
        Fe: Math.round((item.avgPreComposition?.Fe || 85) * 10) / 10,
        C: Math.round((item.avgPreComposition?.C || 0.4) * 1000) / 1000,
        Mn: Math.round((item.avgPreComposition?.Mn || 1.2) * 1000) / 1000,
        Si: Math.round((item.avgPreComposition?.Si || 0.25) * 1000) / 1000,
        Cr: Math.round((item.avgPreComposition?.Cr || 0.8) * 1000) / 1000,
        Ni: Math.round((item.avgPreComposition?.Ni || 0.3) * 1000) / 1000,
        avgCost: Math.round(item.avgCost * 100) / 100
      }
    })

    // Process element statistics
    const elementCostData = elementStats.map(stat => ({
      name: stat._id,
      cost: Math.round(stat.totalCost * 100) / 100,
      pct: Math.round(stat.avgFinalKg * 100) / 100
    }))

    const dashboardData = {
      elements,
      batchHistory: history,
      monthlyTrends: trends,
      elementCostData,
      currentBatch: current ? {
        batchId: current.batchId,
        alloyGrade: current.alloyGrade,
        totalCost: Math.round(current.totalCost * 100) / 100,
        totalAdditions: Math.round(current.totalAdditions * 100) / 100,
        confidence: Math.round(current.confidence * 10) / 10,
        outcome: current.outcome,
        createdAt: current.createdAt.toISOString()
      } : null
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
