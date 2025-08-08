import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { operation, data } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('AlloyMindAI');
    
    switch (operation) {
      case 'bulkInsert':
        if (!Array.isArray(data) || data.length === 0) {
          return NextResponse.json(
            { error: 'Data must be a non-empty array for bulk insert' },
            { status: 400 }
          );
        }
        
        // Validate each log entry
        const validatedLogs = data.map(log => ({
          ...log,
          userId,
          timestamp: log.timestamp ? new Date(log.timestamp) : new Date(),
          createdAt: new Date(),
        }));
        
        const insertResult = await db.collection('Logs').insertMany(validatedLogs);
        
        return NextResponse.json({
          message: `Successfully inserted ${insertResult.insertedCount} log entries`,
          insertedCount: insertResult.insertedCount,
          insertedIds: insertResult.insertedIds
        });
        
      case 'bulkDelete':
        if (!data.ids || !Array.isArray(data.ids)) {
          return NextResponse.json(
            { error: 'ids array is required for bulk delete' },
            { status: 400 }
          );
        }
        
        const deleteResult = await db.collection('Logs').deleteMany({
          id: { $in: data.ids }
        });
        
        return NextResponse.json({
          message: `Successfully deleted ${deleteResult.deletedCount} log entries`,
          deletedCount: deleteResult.deletedCount
        });
        
      case 'export':
        const { searchParams } = new URL(req.url);
        const format = searchParams.get('format') || 'json';
        const alloyGrade = searchParams.get('alloyGrade');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        
        let exportQuery: any = {};
        if (alloyGrade) exportQuery.alloyGrade = alloyGrade;
        if (startDate || endDate) {
          exportQuery.timestamp = {};
          if (startDate) exportQuery.timestamp.$gte = new Date(startDate);
          if (endDate) exportQuery.timestamp.$lte = new Date(endDate);
        }
        
        const exportLogs = await db.collection('Logs')
          .find(exportQuery)
          .sort({ timestamp: -1 })
          .toArray();
        
        if (format === 'csv') {
          // Convert to CSV format
          const csvHeaders = [
            'ID', 'Timestamp', 'Operator', 'Batch ID', 'Alloy Grade',
            'Outcome', 'Cost Impact', 'Confidence', 'Recommendations'
          ];
          
          const csvRows = exportLogs.map(log => [
            log.id,
            log.timestamp?.toISOString(),
            log.operator,
            log.batchId,
            log.alloyGrade,
            log.outcome,
            log.costImpact,
            log.confidence,
            Array.isArray(log.recommendations) ? log.recommendations.join('; ') : ''
          ]);
          
          const csvContent = [csvHeaders, ...csvRows]
            .map(row => row.map(field => `"${field || ''}"`).join(','))
            .join('\n');
          
          return new NextResponse(csvContent, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': 'attachment; filename="decision_logs.csv"'
            }
          });
        }
        
        return NextResponse.json({
          data: exportLogs,
          count: exportLogs.length,
          exportedAt: new Date().toISOString()
        });
        
      default:
        return NextResponse.json(
          { error: 'Invalid operation. Supported: bulkInsert, bulkDelete, export' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' }, 
      { status: 500 }
    );
  }
}
