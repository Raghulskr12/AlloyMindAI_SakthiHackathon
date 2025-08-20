import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30days'
    const alloyGrade = searchParams.get('alloyGrade') || 'all'
    const operator = searchParams.get('operator') || 'all'

    const client = await clientPromise
    const db = client.db('AlloyMindAI')
    const collection = db.collection('Logs')

    // Calculate date range
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Build match criteria
    const matchCriteria: any = {
      createdAt: { $gte: startDate, $lte: now }
    }

    if (alloyGrade !== 'all') {
      matchCriteria.alloyGrade = alloyGrade
    }

    if (operator !== 'all') {
      matchCriteria.operator = operator
    }

    const [
      batchOverview,
      compositionAnalysis,
      costBreakdown,
      elementPerformance,
      aiPerformance,
      recentBatches,
      trendAnalysis
    ] = await Promise.all([
      // Batch overview statistics
      collection.aggregate([
        { $match: matchCriteria },
        {
          $group: {
            _id: null,
            totalBatches: { $sum: 1 },
            avgBatchWeight: { $avg: '$batchWeight' },
            avgTotalCost: { $avg: '$totalCost' },
            avgTotalAdditions: { $avg: '$totalAdditions' },
            avgCostPerKg: { $avg: { $divide: ['$totalCost', '$batchWeight'] } },
            totalCost: { $sum: '$totalCost' },
            totalAdditions: { $sum: '$totalAdditions' },
            approvedBatches: {
              $sum: { $cond: [{ $eq: ['$outcome', 'approved'] }, 1, 0] }
            },
            editedBatches: {
              $sum: { $cond: ['$metallurgistEdits', 1, 0] }
            },
            avgConfidence: { $avg: '$confidence' }
          }
        }
      ]).toArray(),

      // Composition gap analysis - using proper element mapping
      collection.aggregate([
        { $match: matchCriteria },
        { $unwind: '$elementAdjustments' },
        {
          $addFields: {
            elementKey: '$elementAdjustments.element',
            preValue: {
              $switch: {
                branches: [
                  { case: { $eq: ['$elementAdjustments.element', 'C'] }, then: '$preComposition.C' },
                  { case: { $eq: ['$elementAdjustments.element', 'Si'] }, then: '$preComposition.Si' },
                  { case: { $eq: ['$elementAdjustments.element', 'Mn'] }, then: '$preComposition.Mn' },
                  { case: { $eq: ['$elementAdjustments.element', 'P'] }, then: '$preComposition.P' },
                  { case: { $eq: ['$elementAdjustments.element', 'S'] }, then: '$preComposition.S' },
                  { case: { $eq: ['$elementAdjustments.element', 'Cu'] }, then: '$preComposition.Cu' },
                  { case: { $eq: ['$elementAdjustments.element', 'Mg'] }, then: '$preComposition.Mg' }
                ],
                default: 0
              }
            },
            targetValue: {
              $switch: {
                branches: [
                  { case: { $eq: ['$elementAdjustments.element', 'C'] }, then: '$targetComposition.C' },
                  { case: { $eq: ['$elementAdjustments.element', 'Si'] }, then: '$targetComposition.Si' },
                  { case: { $eq: ['$elementAdjustments.element', 'Mn'] }, then: '$targetComposition.Mn' },
                  { case: { $eq: ['$elementAdjustments.element', 'P'] }, then: '$targetComposition.P' },
                  { case: { $eq: ['$elementAdjustments.element', 'S'] }, then: '$targetComposition.S' },
                  { case: { $eq: ['$elementAdjustments.element', 'Cu'] }, then: '$targetComposition.Cu' },
                  { case: { $eq: ['$elementAdjustments.element', 'Mg'] }, then: '$targetComposition.Mg' }
                ],
                default: 0
              }
            },
            postValue: {
              $switch: {
                branches: [
                  { case: { $eq: ['$elementAdjustments.element', 'C'] }, then: '$postComposition.C' },
                  { case: { $eq: ['$elementAdjustments.element', 'Si'] }, then: '$postComposition.Si' },
                  { case: { $eq: ['$elementAdjustments.element', 'Mn'] }, then: '$postComposition.Mn' },
                  { case: { $eq: ['$elementAdjustments.element', 'P'] }, then: '$postComposition.P' },
                  { case: { $eq: ['$elementAdjustments.element', 'S'] }, then: '$postComposition.S' },
                  { case: { $eq: ['$elementAdjustments.element', 'Cu'] }, then: '$postComposition.Cu' },
                  { case: { $eq: ['$elementAdjustments.element', 'Mg'] }, then: '$postComposition.Mg' }
                ],
                default: 0
              }
            }
          }
        },
        {
          $group: {
            _id: '$elementKey',
            avgPreComposition: { $avg: '$preValue' },
            avgTargetComposition: { $avg: '$targetValue' },
            avgPostComposition: { $avg: '$postValue' },
            avgGap: { $avg: { $subtract: ['$targetValue', '$preValue'] } },
            totalAdjustments: { $sum: 1 },
            avgOriginalKg: { $avg: '$elementAdjustments.originalKg' },
            avgFinalKg: { $avg: '$elementAdjustments.finalKg' },
            avgCost: { $avg: '$elementAdjustments.cost' },
            editFrequency: {
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
        { $sort: { avgCost: -1 } }
      ]).toArray(),

      // Cost breakdown by element
      collection.aggregate([
        { $match: matchCriteria },
        { $unwind: '$elementAdjustments' },
        {
          $group: {
            _id: '$elementAdjustments.element',
            totalCost: { $sum: '$elementAdjustments.cost' },
            avgCost: { $avg: '$elementAdjustments.cost' },
            maxCost: { $max: '$elementAdjustments.cost' },
            minCost: { $min: '$elementAdjustments.cost' },
            totalKg: { $sum: '$elementAdjustments.finalKg' },
            avgKg: { $avg: '$elementAdjustments.finalKg' },
            costPerKg: { $avg: { $divide: ['$elementAdjustments.cost', '$elementAdjustments.finalKg'] } },
            usageCount: { $sum: 1 }
          }
        },
        { $sort: { totalCost: -1 } }
      ]).toArray(),

      // Element performance analysis
      collection.aggregate([
        { $match: matchCriteria },
        { $unwind: '$elementAdjustments' },
        {
          $group: {
            _id: {
              element: '$elementAdjustments.element',
              priority: '$elementAdjustments.priority'
            },
            count: { $sum: 1 },
            avgOriginalKg: { $avg: '$elementAdjustments.originalKg' },
            avgFinalKg: { $avg: '$elementAdjustments.finalKg' },
            avgCost: { $avg: '$elementAdjustments.cost' },
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
        { $sort: { '_id.element': 1, '_id.priority': 1 } }
      ]).toArray(),

      // AI performance tracking
      collection.aggregate([
        { $match: matchCriteria },
        {
          $group: {
            _id: '$aiModelUsed',
            totalPredictions: { $sum: 1 },
            avgConfidence: { $avg: '$confidence' },
            avgAccuracy: { $avg: '$modelPerformance.accuracy' },
            avgR2Score: { $avg: '$modelPerformance.r2Score' },
            approvalRate: {
              $avg: { $cond: [{ $eq: ['$outcome', 'approved'] }, 100, 0] }
            },
            editRate: {
              $avg: { $cond: ['$metallurgistEdits', 100, 0] }
            },
            avgTotalCost: { $avg: '$totalCost' },
            avgTotalAdditions: { $avg: '$totalAdditions' }
          }
        },
        { $sort: { totalPredictions: -1 } }
      ]).toArray(),

      // Recent batches for detailed analysis
      collection.aggregate([
        { $match: matchCriteria },
        { $sort: { createdAt: -1 } },
        { $limit: 20 },
        {
          $project: {
            batchId: 1,
            alloyGrade: 1,
            operator: 1,
            createdAt: 1,
            batchWeight: 1,
            totalCost: 1,
            totalAdditions: 1,
            costPerKg: { $divide: ['$totalCost', '$batchWeight'] },
            confidence: 1,
            outcome: 1,
            metallurgistEdits: 1,
            editedElements: 1,
            elementAdjustments: 1,
            preComposition: 1,
            targetComposition: 1,
            postComposition: 1
          }
        }
      ]).toArray(),

      // Trend analysis over time
      collection.aggregate([
        { $match: matchCriteria },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            avgTotalCost: { $avg: '$totalCost' },
            avgTotalAdditions: { $avg: '$totalAdditions' },
            avgCostPerKg: { $avg: { $divide: ['$totalCost', '$batchWeight'] } },
            avgConfidence: { $avg: '$confidence' },
            totalBatches: { $sum: 1 },
            approvalRate: {
              $avg: { $cond: [{ $eq: ['$outcome', 'approved'] }, 100, 0] }
            },
            editRate: {
              $avg: { $cond: ['$metallurgistEdits', 100, 0] }
            }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]).toArray()
    ])

    // Process batch overview
    const overview = batchOverview[0] || {
      totalBatches: 0,
      avgBatchWeight: 0,
      avgTotalCost: 0,
      avgTotalAdditions: 0,
      avgCostPerKg: 0,
      totalCost: 0,
      totalAdditions: 0,
      approvedBatches: 0,
      editedBatches: 0,
      avgConfidence: 0
    }

    // Process composition analysis with proper element mapping
    const compositionData = compositionAnalysis.map(item => {
      const element = item._id
      return {
        element,
        avgPreComposition: Math.round(item.avgPreComposition * 1000) / 1000,
        avgTargetComposition: Math.round(item.avgTargetComposition * 1000) / 1000,
        avgPostComposition: Math.round(item.avgPostComposition * 1000) / 1000,
        avgGap: Math.round(item.avgGap * 1000) / 1000,
        totalAdjustments: item.totalAdjustments,
        avgOriginalKg: Math.round(item.avgOriginalKg * 100) / 100,
        avgFinalKg: Math.round(item.avgFinalKg * 100) / 100,
        avgCost: Math.round(item.avgCost * 100) / 100,
        editFrequency: Math.round(item.editFrequency * 10) / 10
      }
    })

    // Process cost breakdown
    const costData = costBreakdown.map(item => ({
      element: item._id,
      totalCost: Math.round(item.totalCost * 100) / 100,
      avgCost: Math.round(item.avgCost * 100) / 100,
      maxCost: Math.round(item.maxCost * 100) / 100,
      minCost: Math.round(item.minCost * 100) / 100,
      totalKg: Math.round(item.totalKg * 100) / 100,
      avgKg: Math.round(item.avgKg * 100) / 100,
      costPerKg: Math.round(item.costPerKg * 100) / 100,
      usageCount: item.usageCount,
      percentageOfTotal: Math.round((item.totalCost / overview.totalCost) * 100 * 10) / 10
    }))

    // Process element performance
    const elementPerformanceData = elementPerformance.map(item => ({
      element: item._id.element,
      priority: item._id.priority,
      count: item.count,
      avgOriginalKg: Math.round(item.avgOriginalKg * 100) / 100,
      avgFinalKg: Math.round(item.avgFinalKg * 100) / 100,
      avgCost: Math.round(item.avgCost * 100) / 100,
      editRate: Math.round(item.editRate * 10) / 10
    }))

    // Process AI performance
    const aiPerformanceData = aiPerformance.map(item => ({
      model: item._id || 'Unknown',
      totalPredictions: item.totalPredictions,
      avgConfidence: Math.round(item.avgConfidence * 10) / 10,
      avgAccuracy: Math.round((item.avgAccuracy || 95) * 10) / 10,
      avgR2Score: Math.round((item.avgR2Score || 0.95) * 1000) / 1000,
      approvalRate: Math.round(item.approvalRate * 10) / 10,
      editRate: Math.round(item.editRate * 10) / 10,
      avgTotalCost: Math.round(item.avgTotalCost * 100) / 100,
      avgTotalAdditions: Math.round(item.avgTotalAdditions * 100) / 100
    }))

    // Process recent batches
    const recentBatchesData = recentBatches.map(batch => ({
      ...batch,
      costPerKg: Math.round(batch.costPerKg * 100) / 100,
      totalCost: Math.round(batch.totalCost * 100) / 100,
      totalAdditions: Math.round(batch.totalAdditions * 100) / 100,
      confidence: Math.round(batch.confidence * 10) / 10,
      createdAt: batch.createdAt.toISOString()
    }))

    // Process trend analysis
    const trendData = trendAnalysis.map(item => ({
      date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
      avgTotalCost: Math.round(item.avgTotalCost * 100) / 100,
      avgTotalAdditions: Math.round(item.avgTotalAdditions * 100) / 100,
      avgCostPerKg: Math.round(item.avgCostPerKg * 100) / 100,
      avgConfidence: Math.round(item.avgConfidence * 10) / 10,
      totalBatches: item.totalBatches,
      approvalRate: Math.round(item.approvalRate * 10) / 10,
      editRate: Math.round(item.editRate * 10) / 10
    }))

    const metallurgicalData = {
      overview: {
        totalBatches: overview.totalBatches,
        avgBatchWeight: Math.round(overview.avgBatchWeight * 100) / 100,
        avgTotalCost: Math.round(overview.avgTotalCost * 100) / 100,
        avgTotalAdditions: Math.round(overview.avgTotalAdditions * 100) / 100,
        avgCostPerKg: Math.round(overview.avgCostPerKg * 100) / 100,
        totalCost: Math.round(overview.totalCost * 100) / 100,
        totalAdditions: Math.round(overview.totalAdditions * 100) / 100,
        approvalRate: Math.round((overview.approvedBatches / overview.totalBatches) * 100 * 10) / 10,
        editRate: Math.round((overview.editedBatches / overview.totalBatches) * 100 * 10) / 10,
        avgConfidence: Math.round(overview.avgConfidence * 10) / 10
      },
      compositionAnalysis: compositionData,
      costBreakdown: costData,
      elementPerformance: elementPerformanceData,
      aiPerformance: aiPerformanceData,
      recentBatches: recentBatchesData,
      trendAnalysis: trendData
    }

    return NextResponse.json(metallurgicalData)

  } catch (error) {
    console.error('Error fetching metallurgical analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metallurgical data' },
      { status: 500 }
    )
  }
}
