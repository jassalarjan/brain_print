import { customAlphabet } from 'nanoid';
import { MemoryModel } from '../db/user-models';
import { Memory, CreateMemoryRequest } from '../types';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12);

export class MemoryService {
  // Helper to convert Mongoose metadata to type-safe metadata
  private convertMetadata(metadata: any): Memory['metadata'] {
    if (!metadata) return undefined;
    return {
      source: metadata.source || undefined,
      context: metadata.context || undefined,
      triggerWords: metadata.triggerWords || undefined
    };
  }

  async createMemory(userId: string, data: CreateMemoryRequest): Promise<Memory> {
    const memoryId = nanoid();
    
    const memory = await MemoryModel.create({
      memoryId,
      userId,
      type: data.type,
      content: data.content,
      tags: data.tags || [],
      sentiment: data.sentiment || 'neutral',
      metadata: data.metadata || {},
      isPrivate: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return {
      memoryId: memory.memoryId,
      userId: memory.userId,
      type: memory.type,
      content: memory.content,
      tags: memory.tags,
      sentiment: memory.sentiment || undefined,
      metadata: this.convertMetadata(memory.metadata),
      isPrivate: memory.isPrivate,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt
    };
  }

  async getMemories(userId: string, filters?: {
    type?: string;
    tags?: string[];
    sentiment?: string;
    limit?: number;
  }): Promise<Memory[]> {
    const query: any = { userId };

    if (filters?.type) {
      query.type = filters.type;
    }

    if (filters?.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    if (filters?.sentiment) {
      query.sentiment = filters.sentiment;
    }

    const memories = await MemoryModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(filters?.limit || 100);

    return memories.map(m => ({
      memoryId: m.memoryId,
      userId: m.userId,
      type: m.type,
      content: m.content,
      tags: m.tags,
      sentiment: m.sentiment || undefined,
      metadata: this.convertMetadata(m.metadata),
      isPrivate: m.isPrivate,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt
    }));
  }

  async searchMemories(userId: string, searchText: string, limit: number = 20): Promise<Memory[]> {
    const memories = await MemoryModel
      .find({
        userId,
        $text: { $search: searchText }
      })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit);

    return memories.map(m => ({
      memoryId: m.memoryId,
      userId: m.userId,
      type: m.type,
      content: m.content,
      tags: m.tags,
      sentiment: m.sentiment || undefined,
      metadata: this.convertMetadata(m.metadata),
      isPrivate: m.isPrivate,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt
    }));
  }

  async getMemoryById(userId: string, memoryId: string): Promise<Memory | null> {
    const memory = await MemoryModel.findOne({ memoryId, userId });
    if (!memory) return null;

    return {
      memoryId: memory.memoryId,
      userId: memory.userId,
      type: memory.type,
      content: memory.content,
      tags: memory.tags,
      sentiment: memory.sentiment || undefined,
      metadata: this.convertMetadata(memory.metadata),
      isPrivate: memory.isPrivate,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt
    };
  }

  async updateMemory(
    userId: string,
    memoryId: string,
    updates: Partial<CreateMemoryRequest>
  ): Promise<Memory | null> {
    const memory = await MemoryModel.findOne({ memoryId, userId });
    if (!memory) return null;

    if (updates.content) memory.content = updates.content;
    if (updates.type) memory.type = updates.type;
    if (updates.tags) memory.tags = updates.tags;
    if (updates.sentiment) memory.sentiment = updates.sentiment;
    if (updates.metadata) {
      memory.metadata = {
        source: updates.metadata.source || memory.metadata?.source,
        context: updates.metadata.context || memory.metadata?.context,
        triggerWords: updates.metadata.triggerWords || memory.metadata?.triggerWords || []
      };
    }
    memory.updatedAt = new Date();

    await memory.save();

    return {
      memoryId: memory.memoryId,
      userId: memory.userId,
      type: memory.type,
      content: memory.content,
      tags: memory.tags,
      sentiment: memory.sentiment || undefined,
      metadata: this.convertMetadata(memory.metadata),
      isPrivate: memory.isPrivate,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt
    };
  }

  async deleteMemory(userId: string, memoryId: string): Promise<boolean> {
    const result = await MemoryModel.deleteOne({ memoryId, userId });
    return result.deletedCount > 0;
  }

  async getMemoriesByTag(userId: string, tag: string): Promise<Memory[]> {
    const memories = await MemoryModel
      .find({ userId, tags: tag })
      .sort({ createdAt: -1 });

    return memories.map(m => ({
      memoryId: m.memoryId,
      userId: m.userId,
      type: m.type,
      content: m.content,
      tags: m.tags,
      sentiment: m.sentiment || undefined,
      metadata: this.convertMetadata(m.metadata),
      isPrivate: m.isPrivate,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt
    }));
  }

  async getMemoriesBySource(userId: string, source: string): Promise<Memory[]> {
    const memories = await MemoryModel
      .find({ userId, 'metadata.source': source })
      .sort({ createdAt: -1 });

    return memories.map(m => ({
      memoryId: m.memoryId,
      userId: m.userId,
      type: m.type,
      content: m.content,
      tags: m.tags,
      sentiment: m.sentiment || undefined,
      metadata: this.convertMetadata(m.metadata),
      isPrivate: m.isPrivate,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt
    }));
  }
}
