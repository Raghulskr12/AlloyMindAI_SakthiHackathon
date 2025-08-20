import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('AlloyMindAI')
    const collection = db.collection('Logs')

    // Generate sample metallurgical data
    const sampleData = []
    const alloyGrades = ['EN1563', 'ASTMA536_UPDATED', 'ASTMA395_UPDATED']
    const operators = ['John Doe', 'Jane Smith', 'Mike Johnson']
    const elements = ['C', 'Si', 'Mn', 'P', 'S', 'Cu', 'Mg']
    
    // Generate 50 sample batches over the last 90 days
    for (let i = 0; i < 50; i++) {
      const batchDate = new Date()
      batchDate.setDate(batchDate.getDate() - Math.floor(Math.random() * 90))
      
      const alloyGrade = alloyGrades[Math.floor(Math.random() * alloyGrades.length)]
      const operator = operators[Math.floor(Math.random() * operators.length)]
      const batchWeight = 3000
      
      // Generate realistic composition data
      const preComposition = {
        C: 0.35 + Math.random() * 0.1,
        Si: 0.2 + Math.random() * 0.3,
        Mn: 0.6 + Math.random() * 0.4,
        P: 0.02 + Math.random() * 0.03,
        S: 0.015 + Math.random() * 0.025,
        Cu: 0.1 + Math.random() * 0.2,
        Mg: 0.03 + Math.random() * 0.04
      }
      
      const targetComposition = {
        C: 0.38 + Math.random() * 0.04,
        Si: 0.25 + Math.random() * 0.15,
        Mn: 0.7 + Math.random() * 0.2,
        P: 0.025 + Math.random() * 0.015,
        S: 0.02 + Math.random() * 0.01,
        Cu: 0.15 + Math.random() * 0.1,
        Mg: 0.04 + Math.random() * 0.02
      }
      
      const postComposition = {
        C: targetComposition.C + (Math.random() - 0.5) * 0.02,
        Si: targetComposition.Si + (Math.random() - 0.5) * 0.03,
        Mn: targetComposition.Mn + (Math.random() - 0.5) * 0.04,
        P: targetComposition.P + (Math.random() - 0.5) * 0.005,
        S: targetComposition.S + (Math.random() - 0.5) * 0.003,
        Cu: targetComposition.Cu + (Math.random() - 0.5) * 0.02,
        Mg: targetComposition.Mg + (Math.random() - 0.5) * 0.005
      }
      
      // Generate element adjustments
      const elementAdjustments = []
      let totalAdditions = 0
      let totalCost = 0
      
      elements.forEach(element => {
        const gap = targetComposition[element as keyof typeof targetComposition] - preComposition[element as keyof typeof preComposition]
        if (Math.abs(gap) > 0.001) {
          const originalKg = gap * batchWeight / 100
          const finalKg = originalKg + (Math.random() - 0.5) * originalKg * 0.1 // Some metallurgist edits
          
          const costPerKg = {
            'C': 125, 'Si': 100, 'Mn': 330, 'P': 250, 
            'S': 200, 'Cu': 580, 'Mg': 2300
          }[element] || 100
          
          const cost = finalKg * costPerKg
          totalAdditions += finalKg
          totalCost += cost
          
          elementAdjustments.push({
            element,
            originalKg: Math.round(originalKg * 100) / 100,
            finalKg: Math.round(finalKg * 100) / 100,
            cost: Math.round(cost * 100) / 100,
            priority: Math.random() > 0.7 ? 'HIGH' : 'MEDIUM'
          })
        }
      })
      
      const confidence = 85 + Math.random() * 15
      const outcome = Math.random() > 0.1 ? 'approved' : 'rejected'
      const metallurgistEdits = Math.random() > 0.6
      const editedElements = metallurgistEdits ? 
        elements.filter(() => Math.random() > 0.7) : []
      
      const batchData = {
        id: `B${String(i + 1).padStart(3, '0')}`,
        timestamp: batchDate.toISOString().replace('T', ' ').substring(0, 19),
        operator,
        operatorId: `user_${Math.floor(Math.random() * 1000)}`,
        batchId: `BATCH-${String(i + 1).padStart(3, '0')}`,
        alloyGrade,
        furnaceId: `FURNACE-${Math.floor(Math.random() * 5) + 1}`,
        batchWeight,
        preComposition,
        targetComposition,
        postComposition,
        elementAdjustments,
        totalAdditions: Math.round(totalAdditions * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        costPerKg: Math.round((totalCost / batchWeight) * 100) / 100,
        outcome,
        recommendations: [
          `Optimize ${elements[Math.floor(Math.random() * elements.length)]} content`,
          'Monitor temperature variations',
          'Check material quality'
        ],
        aiModelUsed: alloyGrade.includes('UPDATED') ? `${alloyGrade}_MODEL` : 'MULTI_GRADE_MODEL',
        modelPerformance: {
          accuracy: 90 + Math.random() * 8,
          r2Score: 0.85 + Math.random() * 0.12,
          elementsProcessed: elements.length
        },
        metallurgistEdits,
        editedElements,
        confidence: Math.round(confidence * 10) / 10,
        createdAt: batchDate,
        updatedAt: batchDate
      }
      
      sampleData.push(batchData)
    }
    
    // Insert sample data
    if (sampleData.length > 0) {
      await collection.insertMany(sampleData)
    }
    
    return NextResponse.json({ 
      message: `Successfully created ${sampleData.length} sample metallurgical records`,
      count: sampleData.length
    })
    
  } catch (error) {
    console.error('Error creating sample metallurgical data:', error)
    return NextResponse.json(
      { error: 'Failed to create sample data' },
      { status: 500 }
    )
  }
}
