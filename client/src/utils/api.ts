const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
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
};