import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { operation, logIds, updateData } = await request.json()

    if (!operation || !logIds || !Array.isArray(logIds)) {
      return NextResponse.json(
        { error: 'Invalid request. Need operation, logIds array' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('AlloyMindAI')
    const collection = db.collection('Logs')

    let result

    switch (operation) {
      case 'delete':
        result = await collection.deleteMany({
          $or: [
            { id: { $in: logIds } },
            { _id: { $in: logIds.filter(id => /^[0-9a-fA-F]{24}$/.test(id)).map(id => id) } }
          ]
        })
        return NextResponse.json({
          success: true,
          deletedCount: result.deletedCount,
          message: `Deleted ${result.deletedCount} logs`
        })

      case 'update':
        if (!updateData) {
          return NextResponse.json(
            { error: 'Update data required for update operation' },
            { status: 400 }
          )
        }
        
        const updatePayload = {
          ...updateData,
          updatedAt: new Date()
        }
        
        // Remove fields that shouldn't be bulk updated
        delete updatePayload._id
        delete updatePayload.id
        delete updatePayload.createdAt

        result = await collection.updateMany(
          {
            $or: [
              { id: { $in: logIds } },
              { _id: { $in: logIds.filter(id => /^[0-9a-fA-F]{24}$/.test(id)).map(id => id) } }
            ]
          },
          { $set: updatePayload }
        )
        
        return NextResponse.json({
          success: true,
          modifiedCount: result.modifiedCount,
          message: `Updated ${result.modifiedCount} logs`
        })

      case 'export':
        const logs = await collection.find({
          $or: [
            { id: { $in: logIds } },
            { _id: { $in: logIds.filter(id => /^[0-9a-fA-F]{24}$/.test(id)).map(id => id) } }
          ]
        }).toArray()

        return NextResponse.json({
          success: true,
          logs,
          count: logs.length,
          exportedAt: new Date().toISOString()
        })

      default:
        return NextResponse.json(
          { error: `Unknown operation: ${operation}` },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error in bulk operation:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    )
  }
}