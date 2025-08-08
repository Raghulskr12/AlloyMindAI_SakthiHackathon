import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { AlloyConfig } from '@/types/alloy';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(
  req: NextRequest
) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    
    // Use the correct database name with capital letters
    const db = client.db('AlloyMindAI');
    
    // Parse query parameters for filtering
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    
    let query: any = {};
    
    // Build query based on parameters
    if (id) query.id = id;
    if (category) query.category = category;
    
    const alloys = await db.collection<AlloyConfig>('AlloyConfig')
      .find(query)
      .sort({ name: 1 })
      .toArray();
    
    return NextResponse.json(alloys);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alloy configurations' }, 
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest
) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    
    // Validation
    if (!data.name || !data.id || !data.elements || !data.category) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Create new alloy object without the _id field to avoid MongoDB type conflicts
    const newAlloy = {
      ...data,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: data.status || 'active'
    };

    // Remove _id if it exists in the data
    delete newAlloy._id;

    const client = await clientPromise;
    const db = client.db('AlloyMindAI');
    
    // Check for duplicate ID
    const existing = await db.collection('AlloyConfig').findOne({ id: data.id });
    if (existing) {
      return NextResponse.json(
        { error: 'An alloy with this ID already exists' }, 
        { status: 409 }
      );
    }

    const result = await db.collection('AlloyConfig').insertOne(newAlloy);
    
    return NextResponse.json(
      { message: 'Alloy created successfully', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create alloy configuration' }, 
      { status: 500 }
    );
  }
}
