import mongoose from 'mongoose';

// User Schema for authentication
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
});

// Personal Memory/Note Schema
const memorySchema = new mongoose.Schema({
  memoryId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  type: { 
    type: String, 
    enum: ['note', 'quote', 'memory', 'reminder', 'thought', 'achievement'],
    default: 'note'
  },
  content: { type: String, required: true },
  tags: [{ type: String }],
  category: { type: String },
  sentiment: { 
    type: String, 
    enum: ['positive', 'neutral', 'negative', 'motivational', 'sad'],
  },
  isPrivate: { type: Boolean, default: true },
  metadata: {
    source: String, // e.g., 'dad', 'mom', 'self', 'friend'
    context: String, // e.g., 'depression', 'success', 'failure'
    triggerWords: [String], // Words that should trigger this memory
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Context Trigger Schema - For AI responses
const contextTriggerSchema = new mongoose.Schema({
  triggerId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true }, // e.g., "Dad's Motivational Quotes"
  description: String,
  triggerConditions: {
    keywords: [String], // Words that activate this trigger
    sentiments: [String], // Sentiments that activate this trigger
    patterns: [String], // Regex patterns
  },
  responses: [{
    content: String,
    memoryIds: [String], // Reference to specific memories
  }],
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 }, // Higher priority triggers first
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Chat Message Schema - For the chat interface
const chatMessageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['user', 'ai', 'system'],
    default: 'user'
  },
  sentiment: String,
  metadata: mongoose.Schema.Types.Mixed, // For additional context
  triggeredResponses: [{
    triggerId: String,
    content: String,
  }],
  searchable: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// User Settings Schema
const userSettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  aiSettings: {
    enableContextualResponses: { type: Boolean, default: true },
    sentimentAnalysis: { type: Boolean, default: true },
    autoTagging: { type: Boolean, default: true },
  },
  privacySettings: {
    dataEncryption: { type: Boolean, default: true },
    shareAnalytics: { type: Boolean, default: false },
  },
  notificationSettings: {
    dailyReminders: { type: Boolean, default: false },
    motivationalQuotes: { type: Boolean, default: true },
  },
  updatedAt: { type: Date, default: Date.now },
});

// Create indexes for better search performance
memorySchema.index({ content: 'text', tags: 'text' });
chatMessageSchema.index({ content: 'text' });
memorySchema.index({ userId: 1, createdAt: -1 });
chatMessageSchema.index({ userId: 1, createdAt: -1 });
contextTriggerSchema.index({ userId: 1, isActive: 1 });

export const UserModel = mongoose.model('User', userSchema);
export const MemoryModel = mongoose.model('Memory', memorySchema);
export const ContextTriggerModel = mongoose.model('ContextTrigger', contextTriggerSchema);
export const ChatMessageModel = mongoose.model('ChatMessage', chatMessageSchema);
export const UserSettingsModel = mongoose.model('UserSettings', userSettingsSchema);
