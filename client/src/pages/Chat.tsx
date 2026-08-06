import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Header } from '../components/core/Header';
import { Footer } from '../components/core/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface ChatMessage {
  messageId: string;
  content: string;
  type: 'user' | 'ai' | 'system';
  timestamp: Date;
  triggeredResponses?: Array<{ triggerId: string; content: string }>;
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const history = await api.getChatHistory(50);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      navigate('/login');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    try {
      await api.sendMessage(userMessage);
      
      // Add both user message and AI response to chat
      await loadChatHistory(); // Reload to get latest
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadChatHistory();
      return;
    }

    setSearching(true);
    try {
      const results = await api.searchChat(searchQuery, 50);
      setMessages(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    loadChatHistory();
  };

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Personal Chat</h1>
          <p className="text-gray-600">Your AI assistant learns from your memories</p>
        </div>

        {/* Search Bar */}
        <Card className="p-4 mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search chat history..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Button onClick={handleSearch} disabled={searching}>
              🔍 Search
            </Button>
            {searchQuery && (
              <Button onClick={clearSearch} variant="outline">
                Clear
              </Button>
            )}
          </div>
        </Card>

        {/* Messages Container */}
        <Card className="flex-1 mb-4 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p className="text-lg mb-2">No messages yet</p>
                <p className="text-sm">Start a conversation with your AI assistant!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.messageId}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-purple-600 text-white'
                        : message.type === 'ai'
                        ? 'bg-gray-200 text-gray-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.triggeredResponses && message.triggeredResponses.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-300">
                        <p className="text-xs opacity-75 mb-1">Triggered contexts:</p>
                        {message.triggeredResponses.map((tr, idx) => (
                          <div key={idx} className="text-xs opacity-90 mt-1">
                            • {tr.triggerId}
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs opacity-75 mt-1">{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()}>
                {loading ? '...' : '➤ Send'}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: The AI analyzes your sentiment and matches relevant memories to provide personalized support
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
