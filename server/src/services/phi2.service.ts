import { HfInference } from '@huggingface/inference';

export class Phi2Service {
  private hf: HfInference;
  
  constructor() {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      console.warn('⚠️  HUGGINGFACE_API_KEY not found. Using fallback responses.');
    }
    this.hf = new HfInference(apiKey);
    console.log(`🤖 AI Service initialized (using free conversational models)`);
  }

  /**
   * Generate a personalized response using free HF models
   */
  async generateResponse(
    userMessage: string,
    context: {
      sentiment: string;
      isDepressed: boolean;
      depressionSeverity?: string;
      memories: string[];
      userName?: string;
    }
  ): Promise<string> {
    // For now, use smart fallback responses until we get proper API access
    // The free tier Inference API requires PRO account or different auth method
    console.log('Using enhanced fallback responses (HF API requires PRO for chat completion)');
    return this.getEnhancedResponse(userMessage, context);
  }

  /**
   * Enhanced fallback with context-aware responses
   */
  private getEnhancedResponse(userMessage: string, context: any): string {
    const { sentiment, isDepressed, depressionSeverity, memories } = context;
    const lowerMessage = userMessage.toLowerCase();

    // Depression detection with memories
    if (isDepressed && memories.length > 0) {
      const intro = depressionSeverity === 'severe'
        ? "I sense you're going through a really tough time. Here's something that might help:"
        : "I noticed you might be feeling down. Remember this:";

      return `${intro}\n\n${memories.slice(0, 2).join('\n\n')}\n\n💙 You're not alone. I'm here for you.`;
    }

    // Pattern-based responses for common scenarios
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're very welcome! I'm here whenever you need support. 😊";
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      if (memories.length > 0) {
        return `I'm here to help. Looking at your memories, I found this:\n\n${memories[0]}\n\nDoes this resonate with what you need right now?`;
      }
      return "I'm here for you. What's on your mind? Feel free to share, and I'll do my best to support you.";
    }

    if (lowerMessage.includes('motivat') || lowerMessage.includes('inspir')) {
      if (memories.length > 0) {
        const motivationalMemories = memories.filter((m: string) => 
          m.toLowerCase().includes('inspire') || 
          m.toLowerCase().includes('motivat') ||
          m.toLowerCase().includes('believe') ||
          m.toLowerCase().includes('can do')
        );
        
        if (motivationalMemories.length > 0) {
          return `Here's something motivational from your memories:\n\n${motivationalMemories[0]}\n\n✨ You've got this!`;
        }
        return `${memories[0]}\n\n✨ Keep pushing forward!`;
      }
      return "You have incredible strength within you. Every challenge you've faced has made you stronger. Keep going! ✨";
    }

    // Positive sentiment
    if (sentiment === 'positive') {
      const positiveResponses = [
        "That's fantastic! I'm so glad to hear things are going well! Keep that positive energy flowing! ✨",
        "Wonderful news! It's great to see you in such good spirits! 🌟",
        "That's amazing! Your positive outlook is inspiring! Keep it up! 😊",
      ];
      return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    }

    // Negative but not severe
    if (sentiment === 'negative' && !isDepressed) {
      if (memories.length > 0) {
        return `I hear you. Things can be tough sometimes. Here's something from your memories that might help:\n\n${memories[0]}\n\nRemember, every difficulty is temporary. How can I support you?`;
      }
      return "I understand things are challenging right now. Remember, every storm passes. I'm here to listen and support you. 💙";
    }

    // If we have relevant memories, share them
    if (memories.length > 0) {
      return `I found something from your memories that might be relevant:\n\n${memories[0]}\n\nDoes this help with what you're thinking about?`;
    }

    // Contextual default responses
    if (lowerMessage.length < 10) {
      return "I'm listening. Feel free to share more - I'm here for you.";
    }

    if (lowerMessage.includes('?')) {
      return "That's a thoughtful question. While I may not have all the answers, I'm here to think through this with you. What are your thoughts?";
    }

    // Default empathetic response
    return "I hear you. Tell me more about what's on your mind - I'm here to listen and support you. 💙";
  }

  /**
   * Fallback responses when AI is unavailable
   */
  private getFallbackResponse(context: {
    sentiment: string;
    isDepressed: boolean;
    depressionSeverity?: string;
    memories: string[];
  }): string {
    const { sentiment, isDepressed, depressionSeverity, memories } = context;

    // Depression-specific responses
    if (isDepressed && memories.length > 0) {
      const intro = depressionSeverity === 'severe'
        ? "I sense you're going through a really tough time. Here's something that might help:"
        : "I noticed you might be feeling down. Remember this:";

      return `${intro}\n\n${memories.slice(0, 3).join('\n\n')}\n\n💙 You're not alone. I'm here for you.`;
    }

    // Positive sentiment
    if (sentiment === 'positive') {
      return "That's wonderful! I'm glad to hear things are going well. Keep up the positive energy! ✨";
    }

    // Negative but not severe
    if (sentiment === 'negative' && !isDepressed) {
      return "I hear you. Sometimes things can be challenging. Remember, every difficulty is temporary. How can I help?";
    }

    // Memories available
    if (memories.length > 0) {
      return `I found something from your memories that might be relevant:\n\n${memories.slice(0, 2).join('\n\n')}`;
    }

    // Default
    return "I'm listening. Tell me more about what's on your mind.";
  }

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    return !!process.env.HUGGINGFACE_API_KEY;
  }
}
