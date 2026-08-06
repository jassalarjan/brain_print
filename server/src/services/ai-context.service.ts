import { customAlphabet } from 'nanoid';
import { ChatMessageModel, ContextTriggerModel } from '../db/user-models';
import { ChatMessage, TriggeredResponse } from '../types';
import { SentimentService } from './sentiment.service';
import { MemoryService } from './memory.service';
import { Phi2Service } from './phi2.service';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12);

export class AIContextService {
  private sentimentService: SentimentService;
  private memoryService: MemoryService;
  private phi2Service: Phi2Service;

  constructor() {
    this.sentimentService = new SentimentService();
    this.memoryService = new MemoryService();
    this.phi2Service = new Phi2Service();
  }

  async processMessage(userId: string, content: string): Promise<{
    message: ChatMessage;
    aiResponse: string;
    triggeredResponses: TriggeredResponse[];
  }> {
    // Analyze sentiment
    const sentiment = this.sentimentService.analyzeSentiment(content);
    const depression = this.sentimentService.detectDepression(content);

    // Create user message
    const messageId = nanoid();
    const userMessage = await ChatMessageModel.create({
      messageId,
      userId,
      content,
      type: 'user',
      sentiment: sentiment.sentiment,
      metadata: {
        sentimentScore: sentiment.score,
        confidence: sentiment.confidence,
        depression: depression.isDetected ? {
          severity: depression.severity,
          keywords: depression.keywords
        } : undefined
      },
      triggeredResponses: [],
      timestamp: new Date()
    });

    // Match triggers and get responses
    const triggeredResponses = await this.matchTriggers(userId, content, sentiment.sentiment, depression);

    // Generate AI response
    const aiResponse = await this.generateResponse(userId, content, sentiment, depression, triggeredResponses);

    // Save AI message
    const aiMessageId = nanoid();
    await ChatMessageModel.create({
      messageId: aiMessageId,
      userId,
      content: aiResponse,
      type: 'ai',
      sentiment: 'neutral',
      metadata: {
        triggersMatched: triggeredResponses.length,
        responseType: depression.isDetected ? 'supportive' : 'conversational'
      },
      triggeredResponses: [],
      timestamp: new Date()
    });

    // Update user message with triggered responses
    await ChatMessageModel.updateOne(
      { messageId: userMessage.messageId },
      { 
        $set: { 
          triggeredResponses: triggeredResponses.map(tr => ({
            triggerId: tr.triggerName,
            content: tr.memories.join('\\n\\n')
          }))
        }
      }
    );

    return {
      message: {
        messageId: userMessage.messageId,
        userId: userMessage.userId,
        content: userMessage.content,
        type: userMessage.type,
        sentiment: userMessage.sentiment || undefined,
        triggeredResponses: triggeredResponses.map(tr => ({
          triggerId: tr.triggerName,
          content: tr.memories.join('\n\n')
        })),
        searchable: userMessage.searchable,
        createdAt: userMessage.createdAt,
        timestamp: userMessage.timestamp
      },
      aiResponse,
      triggeredResponses
    };
  }

  private async matchTriggers(
    userId: string,
    content: string,
    sentiment: string,
    depression: { isDetected: boolean; severity: string; keywords: string[] }
  ): Promise<TriggeredResponse[]> {
    const triggers = await ContextTriggerModel.find({ userId, isActive: true })
      .sort({ priority: -1 });

    const triggered: TriggeredResponse[] = [];
    const lowerContent = content.toLowerCase();

    for (const trigger of triggers) {
      let matched = false;

      const conditions = trigger.triggerConditions;
      if (!conditions) continue;

      // Check keywords
      if (conditions.keywords && conditions.keywords.length > 0) {
        const keywordMatch = conditions.keywords.some(kw => 
          lowerContent.includes(kw.toLowerCase())
        );
        if (keywordMatch) matched = true;
      }

      // Check sentiments
      if (conditions.sentiments && conditions.sentiments.length > 0) {
        if (conditions.sentiments.includes(sentiment)) {
          matched = true;
        }
      }

      // Check patterns (simple regex)
      if (conditions.patterns && conditions.patterns.length > 0) {
        const patternMatch = conditions.patterns.some(pattern => {
          try {
            const regex = new RegExp(pattern, 'i');
            return regex.test(content);
          } catch {
            return false;
          }
        });
        if (patternMatch) matched = true;
      }

      if (matched) {
        // Get memories for responses
        const responseArray = Array.from(trigger.responses || []);
        const memoryIds = responseArray.flatMap(r => r.memoryIds || []);
        
        const memories = await Promise.all(
          memoryIds.map((memoryId: string) => 
            this.memoryService.getMemoryById(userId, memoryId)
          )
        );

        triggered.push({
          triggerName: trigger.name,
          memories: memories.filter((m: any) => m !== null).map((m: any) => m!.content),
          reason: this.buildTriggerReason(conditions, sentiment, depression)
        });
      }
    }

    return triggered;
  }

  private buildTriggerReason(
    conditions: any,
    sentiment: string,
    depression: { isDetected: boolean; severity: string }
  ): string {
    const reasons: string[] = [];

    if (conditions.sentiments?.includes(sentiment)) {
      reasons.push(`detected ${sentiment} sentiment`);
    }

    if (depression.isDetected && conditions.keywords?.some((kw: string) => 
      ['depress', 'sad', 'hopeless'].some(d => kw.toLowerCase().includes(d))
    )) {
      reasons.push(`depression indicators (${depression.severity})`);
    }

    return reasons.join(', ') || 'matched trigger conditions';
  }

  private async generateResponse(
    userId: string,
    content: string,
    sentiment: any,
    depression: any,
    triggeredResponses: TriggeredResponse[]
  ): Promise<string> {
    // Collect all relevant memories
    const memories = triggeredResponses
      .flatMap(tr => tr.memories)
      .slice(0, 5);

    // Prepare context for Phi-2
    const context = {
      sentiment: sentiment.sentiment,
      isDepressed: depression.isDetected,
      depressionSeverity: depression.severity,
      memories,
    };

    // Try to generate response with Phi-2
    if (this.phi2Service.isAvailable()) {
      try {
        const response = await this.phi2Service.generateResponse(content, context);
        
        // If we have triggered memories and Phi-2 response is generic, append memories
        if (memories.length > 0 && response.length < 100) {
          return `${response}\n\n📝 From your memories:\n${memories.slice(0, 2).join('\n\n')}`;
        }
        
        return response;
      } catch (error) {
        console.error('Phi-2 failed, using fallback:', error);
      }
    }

    // Fallback to rule-based responses
    return this.getFallbackResponse(context);
  }

  private getFallbackResponse(context: {
    sentiment: string;
    isDepressed: boolean;
    depressionSeverity?: string;
    memories: string[];
  }): string {
    const { sentiment, isDepressed, depressionSeverity, memories } = context;

    // If depression detected, prioritize supportive response
    if (isDepressed && memories.length > 0) {
      const intro = depressionSeverity === 'severe' 
        ? "I sense you're going through a really tough time. Here's something that might help:"
        : "I noticed you might be feeling down. Remember this:";

      return `${intro}\n\n${memories.slice(0, 3).join('\n\n')}\n\n💙 You're not alone. I'm here for you.`;
    }

    // If positive sentiment
    if (sentiment === 'positive') {
      return "That's wonderful! I'm glad to hear things are going well. Keep up the positive energy! ✨";
    }

    // If negative but not severe
    if (sentiment === 'negative' && !isDepressed) {
      return "I hear you. Sometimes things can be challenging. Remember, every difficulty is temporary. How can I help?";
    }

    // If triggers matched but not depression
    if (memories.length > 0) {
      return `I found something from your memories that might be relevant:\n\n${memories.slice(0, 2).join('\n\n')}`;
    }

    // Default conversational response
    return "I'm listening. Tell me more about what's on your mind.";
  }

  async getChatHistory(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    const messages = await ChatMessageModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit);

    return messages.reverse().map(m => ({
      messageId: m.messageId,
      userId: m.userId,
      content: m.content,
      type: m.type,
      sentiment: m.sentiment || undefined,
      triggeredResponses: Array.from(m.triggeredResponses || []).map(tr => ({
        triggerId: tr.triggerId || '',
        content: tr.content || ''
      })),
      searchable: m.searchable,
      createdAt: m.createdAt,
      timestamp: m.timestamp
    }));
  }

  async searchChatHistory(userId: string, searchText: string, limit: number = 20): Promise<ChatMessage[]> {
    const messages = await ChatMessageModel
      .find({
        userId,
        $text: { $search: searchText }
      })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit);

    return messages.map(m => ({
      messageId: m.messageId,
      userId: m.userId,
      content: m.content,
      type: m.type,
      sentiment: m.sentiment || undefined,
      triggeredResponses: Array.from(m.triggeredResponses || []).map(tr => ({
        triggerId: tr.triggerId || '',
        content: tr.content || ''
      })),
      searchable: m.searchable,
      createdAt: m.createdAt,
      timestamp: m.timestamp
    }));
  }
}
