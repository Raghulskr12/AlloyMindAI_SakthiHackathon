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
    
    // Parse query parameters for filtering
    const { searchParams } = new URL(req.url);
    const alloyGrade = searchParams.get('alloyGrade');
    const operator = searchParams.get('operator');
    const outcome = searchParams.get('outcome');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query: any = {};
    
    // Build query based on parameters
    if (alloyGrade) query.alloyGrade = alloyGrade;
    if (operator) query.operator = operator;
    if (outcome) query.outcome = outcome;
    
    // Date range filtering
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const logs = await db.collection('Logs')
      .find(query)
      .sort({ timestamp: -1 }) // Most recent first
      .skip(offset)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const totalCount = await db.collection('Logs').countDocuments(query);
    
    return NextResponse.json({
      logs,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch decision logs' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    
    // Validation
    if (!data.batchId || !data.alloyGrade || !data.outcome) {
      return NextResponse.json(
        { error: 'Missing required fields: batchId, alloyGrade, outcome' }, 
        { status: 400 }
      );
    }

    // Create new log entry
    const newLog = {
      ...data,
      userId,
      timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      createdAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db('AlloyMindAI');
    
    const result = await db.collection('Logs').insertOne(newLog);
    
    return NextResponse.json(
      { message: 'Log entry created successfully', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create log entry' }, 
      { status: 500 }
    );
  }
}
