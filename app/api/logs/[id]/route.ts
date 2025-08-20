import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@clerk/nextjs/server'
import { ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('AlloyMindAI')
    const collection = db.collection('Logs')

    // Try to find by custom ID first, then by MongoDB ObjectId
    let log = await collection.findOne({ id: params.id })
    
    if (!log && ObjectId.isValid(params.id)) {
      log = await collection.findOne({ _id: new ObjectId(params.id) })
    }

    if (!log) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 })
    }

    return NextResponse.json(log)

  } catch (error) {
    console.error('Error fetching log:', error)
    return NextResponse.json(
      { error: 'Failed to fetch log' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updateData = await request.json()
    
    const client = await clientPromise
    const db = client.db('AlloyMindAI')
    const collection = db.collection('Logs')

    // Prepare update data
    const updatedLog = {
      ...updateData,
      updatedAt: new Date()
    }

    // Remove fields that shouldn't be updated
    delete updatedLog._id
    delete updatedLog.id
    delete updatedLog.createdAt

    // Try to update by custom ID first, then by MongoDB ObjectId
    let result = await collection.updateOne(
      { id: params.id },
      { $set: updatedLog }
    )

    if (result.matchedCount === 0 && ObjectId.isValid(params.id)) {
      result = await collection.updateOne(
        { _id: new ObjectId(params.id) },
        { $set: updatedLog }
      )
    }

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount })

  } catch (error) {
    console.error('Error updating log:', error)
    return NextResponse.json(
      { error: 'Failed to update log' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('AlloyMindAI')
    const collection = db.collection('Logs')

    // Try to delete by custom ID first, then by MongoDB ObjectId
    let result = await collection.deleteOne({ id: params.id })

    if (result.deletedCount === 0 && ObjectId.isValid(params.id)) {
      result = await collection.deleteOne({ _id: new ObjectId(params.id) })
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, deletedCount: result.deletedCount })

  } catch (error) {
    console.error('Error deleting log:', error)
    return NextResponse.json(
      { error: 'Failed to delete log' },
      { status: 500 }
    )
  }
}