import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'Request body must be a non-empty array of alloys' }, 
        { status: 400 }
      );
    }

    // Validate all entries
    for (const [index, item] of data.entries()) {
      if (!item.name || !item.id || !item.elements || !item.category) {
        return NextResponse.json(
          { error: `Item at index ${index} is missing required fields` }, 
          { status: 400 }
        );
      }
    }

    const client = await clientPromise;
    const db = client.db('AlloyMindAI');
    
    // Get all existing IDs to check for duplicates
    const existingIds = await db.collection('AlloyConfig')
      .find({}, { projection: { id: 1 } })
      .map(doc => doc.id)
      .toArray();
    
    const existingIdsSet = new Set(existingIds);
    const duplicates = data
      .filter(item => existingIdsSet.has(item.id))
      .map(item => item.id);
    
    if (duplicates.length > 0) {
      return NextResponse.json(
        { error: 'Some alloy IDs already exist', duplicates }, 
        { status: 409 }
      );
    }
    
    // Prepare documents for insertion
    const timestamp = new Date();
    const documentsToInsert = data.map(item => ({
      ...item,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: item.status || 'active'
    }));
    
    // Remove _id field from all documents if it exists
    documentsToInsert.forEach(doc => {
      delete doc._id;
    });
    
    const result = await db.collection('AlloyConfig').insertMany(documentsToInsert);
    
    return NextResponse.json({
      message: 'Alloys imported successfully',
      count: result.insertedCount
    }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to import alloy configurations' }, 
      { status: 500 }
    );
  }
}
