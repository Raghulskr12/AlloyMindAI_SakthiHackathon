import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const client = await clientPromise;
    const db = client.db('AlloyMindAI');
    
    const log = await db.collection('Logs').findOne({ id });
    
    if (!log) {
      return NextResponse.json({ error: 'Log entry not found' }, { status: 404 });
    }
    
    return NextResponse.json(log);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch log entry' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();
    
    // Validation
    if (!data.batchId || !data.alloyGrade || !data.outcome) {
      return NextResponse.json(
        { error: 'Missing required fields: batchId, alloyGrade, outcome' }, 
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('AlloyMindAI');
    
    // Check if log exists
    const existing = await db.collection('Logs').findOne({ id });
    if (!existing) {
      return NextResponse.json({ error: 'Log entry not found' }, { status: 404 });
    }
    
    // Prepare update data
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };
    
    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.createdAt;
    
    const result = await db.collection('Logs').updateOne(
      { id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Log entry not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Log entry updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update log entry' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const client = await clientPromise;
    const db = client.db('AlloyMindAI');
    
    const result = await db.collection('Logs').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Log entry not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Log entry deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete log entry' }, 
      { status: 500 }
    );
  }
}
