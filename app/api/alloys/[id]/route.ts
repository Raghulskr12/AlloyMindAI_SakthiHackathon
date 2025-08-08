import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { AlloyConfig } from '@/types/alloy';
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
    
    const alloy = await db.collection('AlloyConfig').findOne({ id });
    
    if (!alloy) {
      return NextResponse.json({ error: 'Alloy not found' }, { status: 404 });
    }
    
    return NextResponse.json(alloy);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alloy configuration' }, 
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
    if (!data.name || !data.elements || !data.category) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('AlloyMindAI');
    
    // Check if alloy exists
    const existing = await db.collection('AlloyConfig').findOne({ id });
    if (!existing) {
      return NextResponse.json({ error: 'Alloy not found' }, { status: 404 });
    }
    
    // Prepare update data
    const updateData: Partial<AlloyConfig> = {
      ...data,
      updatedAt: new Date(),
    };
    
    // Don't allow changing the ID
    delete updateData.id;
    delete updateData._id;
    
    const result = await db.collection('AlloyConfig').updateOne(
      { id },
      { $set: updateData }
    );
    
    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'No changes made' });
    }
    
    return NextResponse.json({ message: 'Alloy updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update alloy configuration' }, 
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
    
    const result = await db.collection('AlloyConfig').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Alloy not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Alloy deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete alloy configuration' }, 
      { status: 500 }
    );
  }
}
