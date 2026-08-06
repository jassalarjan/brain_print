export class SentimentService {
  // Simple keyword-based sentiment analysis
  // In production, you'd use a proper NLP library or API
  
  private positiveKeywords = [
    'happy', 'joy', 'excited', 'great', 'amazing', 'wonderful', 'love',
    'excellent', 'fantastic', 'good', 'awesome', 'brilliant', 'perfect',
    'grateful', 'blessed', 'fortunate', 'proud', 'hopeful', 'optimistic'
  ];

  private negativeKeywords = [
    'sad', 'depressed', 'unhappy', 'terrible', 'awful', 'horrible', 'hate',
    'worst', 'bad', 'angry', 'frustrated', 'disappointed', 'upset', 'hurt',
    'pain', 'suffer', 'crying', 'lonely', 'worthless', 'hopeless', 'anxious'
  ];

  private depressionKeywords = [
    'depressed', 'depression', 'hopeless', 'worthless', 'suicidal', 'ending it',
    'give up', 'no point', 'empty', 'numb', 'tired of life', 'can\'t go on',
    'want to die', 'no future', 'burden', 'meaningless', 'alone', 'isolated'
  ];

  private motivationalKeywords = [
    'motivate', 'inspire', 'encourage', 'strength', 'courage', 'keep going',
    'believe', 'achieve', 'succeed', 'overcome', 'persevere', 'resilient'
  ];

  analyzeSentiment(text: string): {
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    confidence: number;
  } {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);

    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      if (this.positiveKeywords.some(kw => word.includes(kw))) {
        positiveCount++;
      }
      if (this.negativeKeywords.some(kw => word.includes(kw))) {
        negativeCount++;
      }
    });

    const totalSentiment = positiveCount + negativeCount;
    
    if (totalSentiment === 0) {
      return { sentiment: 'neutral', score: 0, confidence: 0.5 };
    }

    const score = (positiveCount - negativeCount) / words.length;
    const confidence = Math.min(totalSentiment / words.length * 2, 1);

    let sentiment: 'positive' | 'negative' | 'neutral';
    if (score > 0.05) {
      sentiment = 'positive';
    } else if (score < -0.05) {
      sentiment = 'negative';
    } else {
      sentiment = 'neutral';
    }

    return { sentiment, score, confidence };
  }

  detectDepression(text: string): {
    isDetected: boolean;
    severity: 'none' | 'mild' | 'moderate' | 'severe';
    keywords: string[];
  } {
    const lowerText = text.toLowerCase();
    const detectedKeywords: string[] = [];

    this.depressionKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        detectedKeywords.push(keyword);
      }
    });

    const keywordCount = detectedKeywords.length;

    let severity: 'none' | 'mild' | 'moderate' | 'severe';
    if (keywordCount === 0) {
      severity = 'none';
    } else if (keywordCount <= 2) {
      severity = 'mild';
    } else if (keywordCount <= 4) {
      severity = 'moderate';
    } else {
      severity = 'severe';
    }

    return {
      isDetected: keywordCount > 0,
      severity,
      keywords: detectedKeywords
    };
  }

  categorizeEmotion(text: string): {
    primary: string;
    secondary?: string;
    intensity: number;
  } {
    const sentiment = this.analyzeSentiment(text);
    const depression = this.detectDepression(text);

    if (depression.isDetected) {
      return {
        primary: 'sadness',
        secondary: 'hopelessness',
        intensity: depression.severity === 'severe' ? 0.9 : 
                   depression.severity === 'moderate' ? 0.7 : 0.5
      };
    }

    if (sentiment.sentiment === 'positive') {
      return {
        primary: 'joy',
        intensity: Math.abs(sentiment.score)
      };
    } else if (sentiment.sentiment === 'negative') {
      return {
        primary: 'sadness',
        intensity: Math.abs(sentiment.score)
      };
    }

    return {
      primary: 'neutral',
      intensity: 0.5
    };
  }

  isMotivationalContent(text: string): boolean {
    const lowerText = text.toLowerCase();
    return this.motivationalKeywords.some(kw => lowerText.includes(kw));
  }
}
