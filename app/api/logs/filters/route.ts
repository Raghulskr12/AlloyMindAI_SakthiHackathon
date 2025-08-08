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
    
    // Get unique values for filters
    const [alloyGrades, operators, outcomes] = await Promise.all([
      db.collection('Logs').distinct('alloyGrade'),
      db.collection('Logs').distinct('operator'),
      db.collection('Logs').distinct('outcome')
    ]);
    
    return NextResponse.json({
      alloyGrades: alloyGrades.filter(grade => grade && typeof grade === 'string'),
      operators: operators.filter(op => op && typeof op === 'string'),
      outcomes: outcomes.filter(outcome => outcome && typeof outcome === 'string')
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' }, 
      { status: 500 }
    );
  }
}
