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
    
    // Get distinct categories from the alloys collection
    const categories = await db.collection('AlloyConfig').distinct('category');
    
    return NextResponse.json(categories.sort());
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alloy categories' }, 
      { status: 500 }
    );
  }
}
