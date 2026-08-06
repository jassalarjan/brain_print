import { customAlphabet } from 'nanoid';
import { ContextTriggerModel } from '../db/user-models';
import { ContextTrigger, CreateTriggerRequest } from '../types';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12);

export class TriggerService {
  async createTrigger(userId: string, data: CreateTriggerRequest): Promise<ContextTrigger> {
    const triggerId = nanoid();

    const trigger = await ContextTriggerModel.create({
      triggerId,
      userId,
      name: data.name,
      description: data.description,
      triggerConditions: data.triggerConditions,
      responses: data.responses,
      priority: data.priority || 5,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return {
      triggerId: trigger.triggerId,
      userId: trigger.userId,
      name: trigger.name,
      description: trigger.description || undefined,
      triggerConditions: trigger.triggerConditions || { keywords: [], sentiments: [], patterns: [] },
      responses: Array.from(trigger.responses || []).map(r => ({
        content: r.content || '',
        memoryIds: r.memoryIds || []
      })),
      priority: trigger.priority,
      isActive: trigger.isActive,
      createdAt: trigger.createdAt,
      updatedAt: trigger.updatedAt
    };
  }

  async getTriggers(userId: string): Promise<ContextTrigger[]> {
    const triggers = await ContextTriggerModel
      .find({ userId })
      .sort({ priority: -1, createdAt: -1 });

    return triggers.map(t => ({
      triggerId: t.triggerId,
      userId: t.userId,
      name: t.name,
      description: t.description || undefined,
      triggerConditions: t.triggerConditions || { keywords: [], sentiments: [], patterns: [] },
      responses: Array.from(t.responses || []).map(r => ({
        content: r.content || '',
        memoryIds: r.memoryIds || []
      })),
      priority: t.priority,
      isActive: t.isActive,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }));
  }

  async getTriggerById(userId: string, triggerId: string): Promise<ContextTrigger | null> {
    const trigger = await ContextTriggerModel.findOne({ triggerId, userId });
    if (!trigger) return null;

    return {
      triggerId: trigger.triggerId,
      userId: trigger.userId,
      name: trigger.name,
      description: trigger.description || undefined,
      triggerConditions: trigger.triggerConditions || { keywords: [], sentiments: [], patterns: [] },
      responses: Array.from(trigger.responses || []).map(r => ({
        content: r.content || '',
        memoryIds: r.memoryIds || []
      })),
      priority: trigger.priority,
      isActive: trigger.isActive,
      createdAt: trigger.createdAt,
      updatedAt: trigger.updatedAt
    };
  }

  async updateTrigger(
    userId: string,
    triggerId: string,
    updates: Partial<CreateTriggerRequest>
  ): Promise<ContextTrigger | null> {
    const trigger = await ContextTriggerModel.findOne({ triggerId, userId });
    if (!trigger) return null;

    if (updates.name) trigger.name = updates.name;
    if (updates.description) trigger.description = updates.description;
    if (updates.triggerConditions) trigger.triggerConditions = updates.triggerConditions;
    if (updates.responses) {
      // Clear existing and add new responses
      trigger.responses = [] as any;
      updates.responses.forEach((r: any) => trigger.responses.push(r));
    }
    if (updates.priority !== undefined) trigger.priority = updates.priority;
    trigger.updatedAt = new Date();

    await trigger.save();

    return {
      triggerId: trigger.triggerId,
      userId: trigger.userId,
      name: trigger.name,
      description: trigger.description || undefined,
      triggerConditions: trigger.triggerConditions || { keywords: [], sentiments: [], patterns: [] },
      responses: Array.from(trigger.responses || []).map(r => ({
        content: r.content || '',
        memoryIds: r.memoryIds || []
      })),
      priority: trigger.priority,
      isActive: trigger.isActive,
      createdAt: trigger.createdAt,
      updatedAt: trigger.updatedAt
    };
  }

  async toggleTrigger(userId: string, triggerId: string): Promise<ContextTrigger | null> {
    const trigger = await ContextTriggerModel.findOne({ triggerId, userId });
    if (!trigger) return null;

    trigger.isActive = !trigger.isActive;
    trigger.updatedAt = new Date();
    await trigger.save();

    return {
      triggerId: trigger.triggerId,
      userId: trigger.userId,
      name: trigger.name,
      description: trigger.description || undefined,
      triggerConditions: trigger.triggerConditions || { keywords: [], sentiments: [], patterns: [] },
      responses: Array.from(trigger.responses || []).map(r => ({
        content: r.content || '',
        memoryIds: r.memoryIds || []
      })),
      priority: trigger.priority,
      isActive: trigger.isActive,
      createdAt: trigger.createdAt,
      updatedAt: trigger.updatedAt
    };
  }

  async deleteTrigger(userId: string, triggerId: string): Promise<boolean> {
    const result = await ContextTriggerModel.deleteOne({ triggerId, userId });
    return result.deletedCount > 0;
  }

  async createDefaultTriggers(userId: string): Promise<void> {
    // Create a default "Dad's Motivational Quotes" trigger
    await this.createTrigger(userId, {
      name: "Dad's Motivational Quotes",
      description: "Shows dad's quotes when feeling down",
      triggerConditions: {
        keywords: ['depressed', 'sad', 'down', 'hopeless', 'tired', 'give up'],
        sentiments: ['negative'],
        patterns: []
      },
      responses: [{
        content: "Motivational support from memories tagged with 'dad'",
        memoryIds: [] // User will add their dad's quotes
      }],
      priority: 10
    });
  }
}
