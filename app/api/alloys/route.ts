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

    // Add connection timeout handling
    const client = await Promise.race([
      clientPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 15000)
      )
    ]);
    
    // Use the correct database name with capital letters
    const db = (client as any).db('AlloyMindAI');
    
    // Parse query parameters for filtering
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    
    let query: any = {};
    
    // Build query based on parameters
    if (id) query.id = id;
    if (category) query.category = category;
    
    const alloys = await db.collection('AlloyConfig')
      .find(query)
      .sort({ name: 1 })
      .toArray();
    
    return NextResponse.json(alloys);
  } catch (error) {
    console.error('Database error:', error);
    
    // Provide more specific error messages for GET requests
    let errorMessage = 'Failed to fetch alloy configurations';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('ETIMEOUT')) {
        errorMessage = 'Database connection timeout. Please refresh the page.';
        statusCode = 503;
      } else if (error.message.includes('connection')) {
        errorMessage = 'Database connection failed. Please check your connection.';
        statusCode = 503;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: statusCode }
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

    // Add connection timeout handling
    const client = await Promise.race([
      clientPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 15000)
      )
    ]);

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

    const mongoClient = client as any;
    const db = mongoClient.db('AlloyMindAI');
    
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
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create alloy configuration';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('ETIMEOUT')) {
        errorMessage = 'Database connection timeout. Please try again.';
        statusCode = 503;
      } else if (error.message.includes('connection')) {
        errorMessage = 'Database connection failed. Please try again.';
        statusCode = 503;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: statusCode }
    );
  }
}
