import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('AlloyMindAI');
    
    // Parse query parameters for date range
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let dateQuery: any = {};
    if (startDate || endDate) {
      dateQuery.timestamp = {};
      if (startDate) dateQuery.timestamp.$gte = new Date(startDate);
      if (endDate) dateQuery.timestamp.$lte = new Date(endDate);
    }
    
    // Get statistics
    const [
      totalLogs,
      successCount,
      failureCount,
      avgConfidence,
      totalCostSavings,
      recentLogs
    ] = await Promise.all([
      // Total count
      db.collection('Logs').countDocuments(dateQuery),
      
      // Success count
      db.collection('Logs').countDocuments({ ...dateQuery, outcome: 'success' }),
      
      // Failure count
      db.collection('Logs').countDocuments({ ...dateQuery, outcome: { $ne: 'success' } }),
      
      // Average confidence
      db.collection('Logs').aggregate([
        { $match: dateQuery },
        { $group: { _id: null, avgConfidence: { $avg: '$confidence' } } }
      ]).toArray(),
      
      // Total cost savings (negative cost impact means savings)
      db.collection('Logs').aggregate([
        { $match: { ...dateQuery, costImpact: { $lt: 0 } } },
        { $group: { _id: null, totalSavings: { $sum: { $abs: '$costImpact' } } } }
      ]).toArray(),
      
      // Recent logs for quick overview
      db.collection('Logs')
        .find(dateQuery)
        .sort({ timestamp: -1 })
        .limit(5)
        .toArray()
    ]);
    
    // Calculate success rate
    const successRate = totalLogs > 0 ? (successCount / totalLogs) * 100 : 0;
    
    // Get top alloy grades by frequency
    const topAlloyGrades = await db.collection('Logs').aggregate([
      { $match: dateQuery },
      { $group: { _id: '$alloyGrade', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray();
    
    return NextResponse.json({
      summary: {
        totalLogs,
        successCount,
        failureCount,
        successRate: Math.round(successRate * 100) / 100,
        avgConfidence: avgConfidence[0]?.avgConfidence || 0,
        totalCostSavings: totalCostSavings[0]?.totalSavings || 0
      },
      topAlloyGrades: topAlloyGrades.map(item => ({
        alloyGrade: item._id,
        count: item.count
      })),
      recentLogs
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' }, 
      { status: 500 }
    );
  }
}
