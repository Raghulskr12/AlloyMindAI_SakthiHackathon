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

    // Get current date and last 24 hours
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [
      recentActivity,
      modelPerformance,
      systemHealth,
      errorAnalysis
    ] = await Promise.all([
      // Recent activity in last 24 hours
      collection.aggregate([
        {
          $match: {
            createdAt: { $gte: last24Hours }
          }
        },
        {
          $group: {
            _id: {
              hour: { $hour: '$createdAt' },
              model: '$aiModelUsed'
            },
            count: { $sum: 1 },
            avgConfidence: { $avg: '$confidence' },
            avgResponseTime: { $avg: 1.2 } // Simulated response time
          }
        },
        { $sort: { '_id.hour': 1 } }
      ]).toArray(),

      // Model performance metrics
      collection.aggregate([
        {
          $match: {
            createdAt: { $gte: lastWeek }
          }
        },
        {
          $group: {
            _id: '$aiModelUsed',
            totalPredictions: { $sum: 1 },
            avgAccuracy: { $avg: '$modelPerformance.accuracy' },
            avgR2Score: { $avg: '$modelPerformance.r2Score' },
            avgConfidence: { $avg: '$confidence' },
            approvalRate: {
              $avg: { $cond: [{ $eq: ['$outcome', 'approved'] }, 100, 0] }
            },
            editRate: {
              $avg: { $cond: ['$metallurgistEdits', 100, 0] }
            }
          }
        }
      ]).toArray(),

      // System health indicators (simulated based on usage patterns)
      collection.aggregate([
        {
          $match: {
            createdAt: { $gte: last24Hours }
          }
        },
        {
          $group: {
            _id: null,
            totalRequests: { $sum: 1 },
            avgProcessingTime: { $avg: 1.2 },
            maxProcessingTime: { $max: 2.1 },
            successRate: {
              $avg: { $cond: [{ $eq: ['$outcome', 'approved'] }, 100, 0] }
            }
          }
        }
      ]).toArray(),

      // Error analysis (based on low confidence predictions)
      collection.aggregate([
        {
          $match: {
            createdAt: { $gte: lastWeek },
            confidence: { $lt: 80 }
          }
        },
        {
          $group: {
            _id: '$alloyGrade',
            lowConfidenceCount: { $sum: 1 },
            avgConfidence: { $avg: '$confidence' },
            commonElements: {
              $push: '$editedElements'
            }
          }
        }
      ]).toArray()
    ])

    // Calculate system metrics
    const totalRequestsToday = recentActivity.reduce((sum, item) => sum + item.count, 0)
    const avgResponseTime = systemHealth[0]?.avgProcessingTime || 1.2
    const successRate = systemHealth[0]?.successRate || 95

    // Simulate system resource usage based on activity
    const memoryUsage = Math.min(90, 45 + (totalRequestsToday / 10))
    const cpuUsage = Math.min(80, 15 + (totalRequestsToday / 20))
    const queueSize = Math.max(0, totalRequestsToday - 100)

    // Process model health data
    const modelHealthData = {
      systemStatus: {
        status: successRate > 90 && avgResponseTime < 2.0 ? 'healthy' : 
               successRate > 80 && avgResponseTime < 3.0 ? 'warning' : 'critical',
        uptime: '99.7%', // Simulated
        lastUpdate: now.toISOString(),
        version: 'v3.1.0'
      },

      performance: {
        totalPredictions: totalRequestsToday,
        avgResponseTime: Math.round(avgResponseTime * 100) / 100,
        successRate: Math.round(successRate * 10) / 10,
        throughput: Math.round(totalRequestsToday / 24 * 10) / 10 // predictions per hour
      },

      resources: {
        memoryUsage: Math.round(memoryUsage),
        cpuUsage: Math.round(cpuUsage),
        diskUsage: 67, // Simulated
        queueSize: queueSize,
        activeConnections: Math.max(1, Math.floor(totalRequestsToday / 10))
      },

      models: modelPerformance.map(model => ({
        name: model._id || 'Unknown',
        status: model.avgAccuracy > 90 ? 'healthy' : 
                model.avgAccuracy > 80 ? 'warning' : 'critical',
        accuracy: Math.round((model.avgAccuracy || 95) * 10) / 10,
        r2Score: Math.round((model.avgR2Score || 0.95) * 1000) / 1000,
        confidence: Math.round(model.avgConfidence * 10) / 10,
        approvalRate: Math.round(model.approvalRate * 10) / 10,
        editRate: Math.round(model.editRate * 10) / 10,
        predictions: model.totalPredictions,
        lastUsed: now.toISOString()
      })),

      recentActivity: recentActivity.map(activity => ({
        hour: activity._id.hour,
        model: activity._id.model,
        requests: activity.count,
        avgConfidence: Math.round(activity.avgConfidence * 10) / 10,
        avgResponseTime: Math.round(activity.avgResponseTime * 100) / 100
      })),

      alerts: [
        ...(memoryUsage > 80 ? [{
          type: 'warning',
          message: `High memory usage: ${memoryUsage}%`,
          timestamp: now.toISOString()
        }] : []),
        ...(cpuUsage > 70 ? [{
          type: 'warning', 
          message: `High CPU usage: ${cpuUsage}%`,
          timestamp: now.toISOString()
        }] : []),
        ...(queueSize > 10 ? [{
          type: 'warning',
          message: `High queue size: ${queueSize} pending requests`,
          timestamp: now.toISOString()
        }] : []),
        ...(errorAnalysis.length > 0 ? errorAnalysis.map(error => ({
          type: 'info',
          message: `Low confidence predictions for ${error._id}: ${error.lowConfidenceCount} cases`,
          timestamp: now.toISOString()
        })) : [])
      ]
    }

    return NextResponse.json(modelHealthData)

  } catch (error) {
    console.error('Error fetching model health:', error)
    return NextResponse.json(
      { error: 'Failed to fetch model health data' },
      { status: 500 }
    )
  }
}

