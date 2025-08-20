import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('AlloyMindAI')
    const collection = db.collection('Logs')

    // Get distinct values for filters
    const [alloyGrades, operators, outcomes] = await Promise.all([
      collection.distinct('alloyGrade'),
      collection.distinct('operator'),
      collection.distinct('outcome')
    ])

    return NextResponse.json({
      alloyGrades: alloyGrades.sort(),
      operators: operators.sort(),
      outcomes: outcomes.sort()
    })

  } catch (error) {
    console.error('Error fetching log filters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    )
  }
}