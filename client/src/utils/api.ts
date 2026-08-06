const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to get auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Helper to add auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Export helper functions
  getAuthToken,
  getAuthHeaders,

  // Authentication endpoints
  async register(email: string, password: string, name: string) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    const data = await response.json();
    // Store token
    localStorage.setItem('authToken', data.token);
    return data;
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    const data = await response.json();
    // Store token
    localStorage.setItem('authToken', data.token);
    return data;
  },

  async logout() {
    localStorage.removeItem('authToken');
  },

  async getAuthProfile() {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  },

  async updatePassword(oldPassword: string, newPassword: string) {
    const response = await fetch(`${API_URL}/api/auth/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update password');
    }
    return await response.json();
  },

  // Memory endpoints
  async createMemory(content: string, type: string, tags?: string[], metadata?: any) {
    const response = await fetch(`${API_URL}/api/memory`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content, type, tags, metadata }),
    });
    if (!response.ok) throw new Error('Failed to create memory');
    return await response.json();
  },

  async getMemories(filters?: { type?: string; tags?: string; sentiment?: string; limit?: number }) {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.tags) params.append('tags', filters.tags);
    if (filters?.sentiment) params.append('sentiment', filters.sentiment);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${API_URL}/api/memory?${params}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch memories');
    return await response.json();
  },

  async searchMemories(query: string, limit?: number) {
    const params = new URLSearchParams({ q: query });
    if (limit) params.append('limit', limit.toString());

    const response = await fetch(`${API_URL}/api/memory/search?${params}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Search failed');
    return await response.json();
  },

  async getMemory(memoryId: string) {
    const response = await fetch(`${API_URL}/api/memory/${memoryId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Memory not found');
    return await response.json();
  },

  async updateMemory(memoryId: string, updates: any) {
    const response = await fetch(`${API_URL}/api/memory/${memoryId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update memory');
    return await response.json();
  },

  async deleteMemory(memoryId: string) {
    const response = await fetch(`${API_URL}/api/memory/${memoryId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete memory');
    return await response.json();
  },

  async getMemoriesByTag(tag: string) {
    const response = await fetch(`${API_URL}/api/memory/tag/${tag}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch memories');
    return await response.json();
  },

  async getMemoriesBySource(source: string) {
    const response = await fetch(`${API_URL}/api/memory/source/${source}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch memories');
    return await response.json();
  },

  // Chat endpoints
  async sendMessage(content: string) {
    const response = await fetch(`${API_URL}/api/chat/message`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return await response.json();
  },

  async getChatHistory(limit?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());

    const response = await fetch(`${API_URL}/api/chat/history?${params}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch chat history');
    return await response.json();
  },

  async searchChat(query: string, limit?: number) {
    const params = new URLSearchParams({ q: query });
    if (limit) params.append('limit', limit.toString());

    const response = await fetch(`${API_URL}/api/chat/search?${params}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Chat search failed');
    return await response.json();
  },

  // Trigger endpoints
  async createTrigger(data: any) {
    const response = await fetch(`${API_URL}/api/trigger`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create trigger');
    return await response.json();
  },

  async getTriggers() {
    const response = await fetch(`${API_URL}/api/trigger`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch triggers');
    return await response.json();
  },

  async getTrigger(triggerId: string) {
    const response = await fetch(`${API_URL}/api/trigger/${triggerId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Trigger not found');
    return await response.json();
  },

  async updateTrigger(triggerId: string, updates: any) {
    const response = await fetch(`${API_URL}/api/trigger/${triggerId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update trigger');
    return await response.json();
  },

  async toggleTrigger(triggerId: string) {
    const response = await fetch(`${API_URL}/api/trigger/${triggerId}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to toggle trigger');
    return await response.json();
  },

  async deleteTrigger(triggerId: string) {
    const response = await fetch(`${API_URL}/api/trigger/${triggerId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete trigger');
    return await response.json();
  },

  // Existing questionnaire endpoints
  async getQuestions() {
    const response = await fetch(`${API_URL}/api/questions`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    const data = await response.json();
    return data.data;
  },

  async calculateScores(answers: Array<{ questionId: string; choiceId: string }>) {
    const response = await fetch(`${API_URL}/api/session/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    if (!response.ok) throw new Error('Failed to calculate scores');
    const data = await response.json();
    return data.data;
  },

  async saveProfile(scores: any, answers: any) {
    const response = await fetch(`${API_URL}/api/profile/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scores, answers }),
    });
    if (!response.ok) throw new Error('Failed to save profile');
    const data = await response.json();
    return data.data;
  },

  async getProfile(profileId: string) {
    const response = await fetch(`${API_URL}/api/profile/${profileId}`);
    if (!response.ok) throw new Error('Profile not found');
    const data = await response.json();
    return data.data;
  },

  // Benchmarking endpoints
  async getBenchmark(profileId: string) {
    const response = await fetch(`${API_URL}/api/benchmark/profile/${profileId}`);
    if (!response.ok) throw new Error('Failed to fetch benchmark');
    return await response.json();
  },

  async updateGlobalBenchmarks() {
    const response = await fetch(`${API_URL}/api/benchmark/update`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to update benchmarks');
    return await response.json();
  },

  async getAllArchetypes() {
    const response = await fetch(`${API_URL}/api/benchmark/archetypes`);
    if (!response.ok) throw new Error('Failed to fetch archetypes');
    return await response.json();
  },

  // Evolution tracking endpoints
  async createSession(userId: string, scores: any, answers: any, metadata?: any) {
    const response = await fetch(`${API_URL}/api/evolution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, scores, answers, metadata }),
    });
    if (!response.ok) throw new Error('Failed to create session');
    return await response.json();
  },

  async getUserSessions(userId: string) {
    const response = await fetch(`${API_URL}/api/evolution/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return await response.json();
  },

  async getEvolutionData(userId: string) {
    const response = await fetch(`${API_URL}/api/evolution/user/${userId}/data`);
    if (!response.ok) throw new Error('Failed to fetch evolution data');
    return await response.json();
  },

  async getEvolutionSummary(userId: string) {
    const response = await fetch(`${API_URL}/api/evolution/user/${userId}/summary`);
    if (!response.ok) throw new Error('Failed to fetch evolution summary');
    return await response.json();
  },

  async compareSessions(sessionId1: string, sessionId2: string) {
    const response = await fetch(
      `${API_URL}/api/evolution/compare?sessionId1=${sessionId1}&sessionId2=${sessionId2}`
    );
    if (!response.ok) throw new Error('Failed to compare sessions');
    return await response.json();
  },

  // Team mapping endpoints
  async createTeam(name: string, memberProfiles: string[], description?: string) {
    const response = await fetch(`${API_URL}/api/team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, memberProfiles, description }),
    });
    if (!response.ok) throw new Error('Failed to create team');
    return await response.json();
  },

  async getTeam(teamId: string) {
    const response = await fetch(`${API_URL}/api/team/${teamId}`);
    if (!response.ok) throw new Error('Failed to fetch team');
    return await response.json();
  },

  async getTeamAnalysis(teamId: string) {
    const response = await fetch(`${API_URL}/api/team/${teamId}/analysis`);
    if (!response.ok) throw new Error('Failed to fetch team analysis');
    return await response.json();
  },

  async getAllTeams() {
    const response = await fetch(`${API_URL}/api/team`);
    if (!response.ok) throw new Error('Failed to fetch teams');
    return await response.json();
  },

  async updateTeamMembers(teamId: string, memberProfiles: string[]) {
    const response = await fetch(`${API_URL}/api/team/${teamId}/members`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberProfiles }),
    });
    if (!response.ok) throw new Error('Failed to update team');
    return await response.json();
  },

  // Pairing endpoints
  async analyzePairing(profileId1: string, profileId2: string) {
    const response = await fetch(`${API_URL}/api/pairing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId1, profileId2 }),
    });
    if (!response.ok) throw new Error('Failed to analyze pairing');
    return await response.json();
  },

  async getPairing(pairingId: string) {
    const response = await fetch(`${API_URL}/api/pairing/${pairingId}`);
    if (!response.ok) throw new Error('Failed to fetch pairing');
    return await response.json();
  },

  async getPairingsForProfile(profileId: string) {
    const response = await fetch(`${API_URL}/api/pairing/profile/${profileId}`);
    if (!response.ok) throw new Error('Failed to fetch pairings');
    return await response.json();
  },
};