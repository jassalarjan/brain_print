export interface Question {
  id: string;
  title: string;
  scenario: string;
  choices: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  scores: TraitScores;
}

export interface TraitScores {
  analytical?: number;
  intuitionDriven?: number;
  sequential?: number;
  improviser?: number;
  riskNeutral?: number;
  comfortSeeker?: number;
  clarityFirst?: number;
  fastDecider?: number;
  overthinker?: number;
  patternSeeker?: number;
}

export interface UserAnswer {
  questionId: string;
  choiceId: string;
}

export interface FinalScores {
  analytical: number;
  intuitionDriven: number;
  sequential: number;
  improviser: number;
  riskNeutral: number;
  comfortSeeker: number;
  clarityFirst: number;
  fastDecider: number;
  overthinker: number;
  patternSeeker: number;
  [key: string]: number; // Index signature for dynamic access
}

export interface Profile {
  id: string;
  scores: FinalScores;
  answers: UserAnswer[];
  createdAt: Date;
}

export interface ScoreRequest {
  answers: UserAnswer[];
}

export interface ScoreResponse {
  scores: FinalScores;
  correlations: TraitCorrelation[];
}

export interface TraitCorrelation {
  trait1: string;
  trait2: string;
  strength: number;
}

export interface SaveProfileRequest {
  scores: FinalScores;
  answers: UserAnswer[];
}

export interface SaveProfileResponse {
  profileId: string;
  shareUrl: string;
}

// Evolution Tracking Types
export interface Session {
  userId: string;
  sessionId: string;
  profileId: string;
  scores: FinalScores;
  answers: UserAnswer[];
  metadata?: {
    context?: string;
    notes?: string;
  };
  createdAt: Date;
}

export interface EvolutionData {
  userId: string;
  sessions: Session[];
  timeSeries: {
    dates: Date[];
    traits: {
      [key: string]: number[];
    };
  };
  driftAnalysis: {
    overallDrift: number;
    traitDrifts: { [key: string]: number };
    stability: number;
  };
  changeVelocity: {
    [key: string]: number;
  };
}

// Benchmarking Types
export interface BenchmarkStats {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

export interface BenchmarkData {
  trait: string;
  statistics: BenchmarkStats;
  sampleSize: number;
  lastUpdated: Date;
}

export interface ProfileBenchmark {
  profileId: string;
  scores: FinalScores;
  percentiles: { [key: string]: number };
  divergenceScore: number;
  traitSkew: { [key: string]: number };
  archetype?: string;
  globalComparison: {
    aboveAverage: string[];
    belowAverage: string[];
    extremeTraits: string[];
  };
}

// Team Mapping Types
export interface AggregateStats {
  mean: number;
  median: number;
  std: number;
}

export interface TeamProfile {
  teamId: string;
  name: string;
  description?: string;
  memberProfiles: string[];
  aggregateScores: { [key: string]: AggregateStats };
  diversityMetrics: {
    overallDiversity: number;
    traitVariance: { [key: string]: number };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamAnalysis {
  team: TeamProfile;
  diversityHeatmap: { [key: string]: number };
  synergyMatrix: Array<{
    member1: string;
    member2: string;
    synergyScore: number;
  }>;
  strengthDistribution: {
    [trait: string]: {
      strong: number;
      moderate: number;
      weak: number;
    };
  };
  conflictPredictions: Array<{
    members: string[];
    trait: string;
    riskLevel: 'low' | 'medium' | 'high';
    description: string;
  }>;
  recommendations: string[];
}

// Cognitive Pairing Types
export interface AlignmentMetrics {
  communicationAlignment: number;
  decisionStyleAlignment: number;
  riskToleranceAlignment: number;
  processingStyleAlignment: number;
}

export interface FrictionZone {
  trait: string;
  severity: number;
  description: string;
}

export interface Strength {
  area: string;
  score: number;
  description: string;
}

export interface CognitivePairing {
  pairingId: string;
  profileId1: string;
  profileId2: string;
  compatibilityScore: number;
  alignmentMetrics: AlignmentMetrics;
  complementarityScore: number;
  frictionZones: FrictionZone[];
  strengths: Strength[];
  interactionModel: string;
  recommendations: string[];
  createdAt: Date;
}

// Archetype Types
export interface CognitiveArchetype {
  name: string;
  description: string;
  dominantTraits: string[];
  characteristicPattern: { [key: string]: number };
  profileIds: string[];
}

// Request/Response Types for new endpoints
export interface CreateSessionRequest {
  userId: string;
  scores: FinalScores;
  answers: UserAnswer[];
  metadata?: {
    context?: string;
    notes?: string;
  };
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  memberProfiles: string[];
}

export interface PairingRequest {
  profileId1: string;
  profileId2: string;
}

// User Authentication Types
export interface User {
  userId: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

export interface TriggeredResponse {
  triggerName: string;
  memories: string[];
  reason: string;
}

// Personal Memory Types
export interface Memory {
  memoryId: string;
  userId: string;
  type: 'note' | 'quote' | 'memory' | 'reminder' | 'thought' | 'achievement';
  content: string;
  tags: string[];
  category?: string;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'motivational' | 'sad';
  isPrivate: boolean;
  metadata?: {
    source?: string;
    context?: string;
    triggerWords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemoryRequest {
  type: Memory['type'];
  content: string;
  tags?: string[];
  category?: string;
  sentiment?: Memory['sentiment'];
  metadata?: Memory['metadata'];
}

export interface UpdateMemoryRequest {
  content?: string;
  tags?: string[];
  category?: string;
  sentiment?: Memory['sentiment'];
  metadata?: Memory['metadata'];
}

// Context Trigger Types
export interface ContextTrigger {
  triggerId: string;
  userId: string;
  name: string;
  description?: string;
  triggerConditions: {
    keywords: string[];
    sentiments: string[];
    patterns: string[];
  };
  responses: Array<{
    content: string;
    memoryIds: string[];
  }>;
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTriggerRequest {
  name: string;
  description?: string;
  triggerConditions: ContextTrigger['triggerConditions'];
  responses: ContextTrigger['responses'];
  priority?: number;
}

// Chat Message Types
export interface ChatMessage {
  messageId: string;
  userId: string;
  content: string;
  type: 'user' | 'ai' | 'system';
  sentiment?: string;
  triggeredResponses?: Array<{
    triggerId: string;
    content: string;
  }>;
  searchable: boolean;
  timestamp: Date;
  createdAt: Date;
}

export interface SendMessageRequest {
  content: string;
  type?: ChatMessage['type'];
}

export interface AIResponse {
  message: string;
  triggeredContexts: Array<{
    triggerName: string;
    content: string;
    source?: string;
  }>;
  sentiment?: string;
  suggestions?: string[];
}

// User Settings Types
export interface UserSettings {
  userId: string;
  aiSettings: {
    enableContextualResponses: boolean;
    sentimentAnalysis: boolean;
    autoTagging: boolean;
  };
  privacySettings: {
    dataEncryption: boolean;
    shareAnalytics: boolean;
  };
  notificationSettings: {
    dailyReminders: boolean;
    motivationalQuotes: boolean;
  };
  updatedAt: Date;
}

export interface UpdateSettingsRequest {
  aiSettings?: Partial<UserSettings['aiSettings']>;
  privacySettings?: Partial<UserSettings['privacySettings']>;
  notificationSettings?: Partial<UserSettings['notificationSettings']>;
}