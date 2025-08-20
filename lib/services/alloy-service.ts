import clientPromise from '@/lib/mongodb';
import { AlloyConfig } from '@/types/alloy';
import { ObjectId } from 'mongodb';

export class AlloyService {
  private static async getCollection() {
    const client = await clientPromise;
    const db = client.db('AlloyMindAI');
    return db.collection('AlloyConfig');
  }

  /**
   * Get all alloys with optional filters
   */
  static async getAllAlloys({
    category,
    status,
    limit = 20,
    skip = 0,
  }: {
    category?: string;
    status?: string;
    limit?: number;
    skip?: number;
  } = {}) {
    const collection = await this.getCollection();
    
    let query: Record<string, any> = {};
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    return collection
      .find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  /**
   * Get a single alloy by ID
   */
  static async getAlloyById(id: string) {
    const collection = await this.getCollection();
    return collection.findOne({ id });
  }

  /**
   * Create a new alloy
   */
  static async createAlloy(alloyData: Omit<AlloyConfig, '_id' | 'createdAt' | 'updatedAt'>, userId: string) {
    const collection = await this.getCollection();
    
    // Create a new object without _id to ensure MongoDB compatibility
    const { _id, ...alloyWithoutId } = alloyData as any;
    
    const newAlloy = {
      ...alloyWithoutId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: alloyData.status || 'active',
    };
    
    const result = await collection.insertOne(newAlloy);
    return result.insertedId;
  }

  /**
   * Update an existing alloy
   */
  static async updateAlloy(id: string, alloyData: Partial<AlloyConfig>) {
    const collection = await this.getCollection();
    
    // Prepare update data
    const updateData = {
      ...alloyData,
      updatedAt: new Date(),
    };
    
    // Don't allow changing the ID or creation date
    delete updateData.id;
    delete updateData._id;
    delete updateData.createdAt;
    
    const result = await collection.updateOne(
      { id },
      { $set: updateData }
    );
    
    return result.modifiedCount > 0;
  }

  /**
   * Delete an alloy
   */
  static async deleteAlloy(id: string) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  /**
   * Search alloys with various filters
   */
  static async searchAlloys({
    query,
    category,
    element,
    application,
    status,
    page = 1,
    limit = 20
  }: {
    query?: string;
    category?: string;
    element?: string;
    application?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const collection = await this.getCollection();
    const skip = (page - 1) * limit;
    
    let filter: Record<string, any> = {};
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { id: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (element) {
      filter[`elements.${element}`] = { $exists: true };
    }
    
    if (application) {
      filter.applications = { $in: [application] };
    }
    
    if (status) {
      filter.status = status;
    }
    
    const totalCount = await collection.countDocuments(filter);
    
    const alloys = await collection
      .find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    return {
      alloys,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    };
  }

  /**
   * Get distinct categories
   */
  static async getCategories() {
    const collection = await this.getCollection();
    return collection.distinct('category');
  }

  /**
   * Get distinct elements across all alloys
   */
  static async getElements() {
    const collection = await this.getCollection();
    
    // Aggregate to extract all element keys
    const result = await collection.aggregate([
      { $project: { elementKeys: { $objectToArray: "$elements" } } },
      { $unwind: "$elementKeys" },
      { $group: { _id: "$elementKeys.k" } },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    return result.map(item => item._id);
  }
}
