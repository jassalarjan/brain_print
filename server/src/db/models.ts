import mongoose from 'mongoose';

// Session Schema - for Evolution Tracking
const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, unique: true, index: true },
  profileId: { type: String, required: true },
  scores: {
    analytical: Number,
    intuitionDriven: Number,
    sequential: Number,
    improviser: Number,
    riskNeutral: Number,
    comfortSeeker: Number,
    clarityFirst: Number,
    fastDecider: Number,
    overthinker: Number,
    patternSeeker: Number,
  },
  answers: [{
    questionId: String,
    choiceId: String,
  }],
  metadata: {
    context: String,
    notes: String,
  },
  createdAt: { type: Date, default: Date.now },
});

// Team Profile Schema
const teamSchema = new mongoose.Schema({
  teamId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: String,
  memberProfiles: [{ type: String }], // Array of profileIds
  aggregateScores: {
    analytical: { mean: Number, median: Number, std: Number },
    intuitionDriven: { mean: Number, median: Number, std: Number },
    sequential: { mean: Number, median: Number, std: Number },
    improviser: { mean: Number, median: Number, std: Number },
    riskNeutral: { mean: Number, median: Number, std: Number },
    comfortSeeker: { mean: Number, median: Number, std: Number },
    clarityFirst: { mean: Number, median: Number, std: Number },
    fastDecider: { mean: Number, median: Number, std: Number },
    overthinker: { mean: Number, median: Number, std: Number },
    patternSeeker: { mean: Number, median: Number, std: Number },
  },
  diversityMetrics: {
    overallDiversity: Number,
    traitVariance: mongoose.Schema.Types.Mixed,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Benchmarking Data Schema - stores global statistics
const benchmarkSchema = new mongoose.Schema({
  trait: { type: String, required: true, index: true },
  statistics: {
    mean: Number,
    median: Number,
    std: Number,
    min: Number,
    max: Number,
    percentiles: {
      p10: Number,
      p25: Number,
      p50: Number,
      p75: Number,
      p90: Number,
      p95: Number,
      p99: Number,
    },
  },
  sampleSize: Number,
  lastUpdated: { type: Date, default: Date.now },
});

// Cognitive Archetype Schema
const archetypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  dominantTraits: [String],
  characteristicPattern: mongoose.Schema.Types.Mixed,
  profileIds: [String], // Profiles matching this archetype
  createdAt: { type: Date, default: Date.now },
});

// Pairing Analysis Schema
const pairingSchema = new mongoose.Schema({
  pairingId: { type: String, required: true, unique: true, index: true },
  profileId1: { type: String, required: true, index: true },
  profileId2: { type: String, required: true, index: true },
  compatibilityScore: Number,
  alignmentMetrics: {
    communicationAlignment: Number,
    decisionStyleAlignment: Number,
    riskToleranceAlignment: Number,
    processingStyleAlignment: Number,
  },
  complementarityScore: Number,
  frictionZones: [{
    trait: String,
    severity: Number,
    description: String,
  }],
  strengths: [{
    area: String,
    score: Number,
    description: String,
  }],
  createdAt: { type: Date, default: Date.now },
});

// Create indexes
sessionSchema.index({ userId: 1, createdAt: -1 });
teamSchema.index({ teamId: 1 });
benchmarkSchema.index({ trait: 1 });
pairingSchema.index({ profileId1: 1, profileId2: 1 });

export const SessionModel = mongoose.model('Session', sessionSchema);
export const TeamModel = mongoose.model('Team', teamSchema);
export const BenchmarkModel = mongoose.model('Benchmark', benchmarkSchema);
export const ArchetypeModel = mongoose.model('Archetype', archetypeSchema);
export const PairingModel = mongoose.model('Pairing', pairingSchema);
