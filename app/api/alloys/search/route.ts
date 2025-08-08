import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const element = searchParams.get('element');
    const application = searchParams.get('application');
    const status = searchParams.get('status');
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Build MongoDB query
    let filter: any = {};
    
    // Text search if query is provided
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { id: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Filter by category if provided
    if (category) {
      filter.category = category;
    }
    
    // Filter by element if provided
    if (element) {
      filter[`elements.${element}`] = { $exists: true };
    }
    
    // Filter by application if provided
    if (application) {
      filter.applications = { $in: [application] };
    }
    
    // Filter by status if provided
    if (status) {
      filter.status = status;
    }
    
    const client = await clientPromise;
    const db = client.db('AlloyMindAI');
    
    // Get total count for pagination
    const totalCount = await db.collection('AlloyConfig').countDocuments(filter);
    
    // Get paginated results
    const alloys = await db.collection('AlloyConfig')
      .find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    return NextResponse.json({
      alloys,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to search alloy configurations' }, 
      { status: 500 }
    );
  }
}
