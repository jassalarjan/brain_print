import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Header } from '../components/core/Header';
import { Footer } from '../components/core/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

export function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ memories: 0, triggers: 0, messages: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await api.getAuthProfile();
      setUser(userData);

      // Load stats
      const [memories, triggers, chatHistory] = await Promise.all([
        api.getMemories({ limit: 1000 }),
        api.getTriggers(),
        api.getChatHistory(1000),
      ]);

      setStats({
        memories: Array.isArray(memories) ? memories.length : 0,
        triggers: Array.isArray(triggers) ? triggers.length : 0,
        messages: Array.isArray(chatHistory) ? chatHistory.length : 0,
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600 mt-1">Your personal context engine dashboard</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Memories</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.memories}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Triggers</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.triggers}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chat Messages</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.messages}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/chat">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">💬 Chat</h3>
              <p className="text-sm text-gray-600">Talk with your AI assistant</p>
            </Card>
          </Link>

          <Link to="/memories">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">📝 Memories</h3>
              <p className="text-sm text-gray-600">Manage your notes and quotes</p>
            </Card>
          </Link>

          <Link to="/triggers">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">⚡ Triggers</h3>
              <p className="text-sm text-gray-600">Configure context responses</p>
            </Card>
          </Link>

          <Link to="/questionnaire">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">🧠 Assessment</h3>
              <p className="text-sm text-gray-600">Take cognitive profile test</p>
            </Card>
          </Link>
        </div>

        {/* Getting Started Guide */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm mr-3">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Add Your First Memory</h4>
                <p className="text-sm text-gray-600">Store important quotes, notes, or memories that matter to you. Try adding a motivational quote from someone you love!</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm mr-3">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Create a Trigger</h4>
                <p className="text-sm text-gray-600">Set up automatic responses based on your mood or keywords. For example, show dad's quotes when you're feeling down.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm mr-3">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Chat with Your AI</h4>
                <p className="text-sm text-gray-600">Start a conversation and watch how the AI learns from your memories to provide personalized support.</p>
              </div>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
