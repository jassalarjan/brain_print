import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Header } from '../components/core/Header';
import { Footer } from '../components/core/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface Memory {
  memoryId: string;
  content: string;
  type: string;
  tags: string[];
  sentiment?: string;
  metadata?: {
    source?: string;
    context?: string;
  };
  createdAt: Date;
}

export function Memories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    content: '',
    type: 'note',
    tags: '',
    source: '',
    context: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadMemories();
  }, [filterType]);

  const loadMemories = async () => {
    try {
      const data = await api.getMemories(filterType ? { type: filterType } : {});
      setMemories(data);
    } catch (error) {
      console.error('Failed to load memories:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadMemories();
      return;
    }

    try {
      const results = await api.searchMemories(searchQuery);
      setMemories(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      const metadata: any = {};
      if (formData.source) metadata.source = formData.source;
      if (formData.context) metadata.context = formData.context;

      if (editingId) {
        await api.updateMemory(editingId, {
          content: formData.content,
          type: formData.type,
          tags,
          metadata,
        });
      } else {
        await api.createMemory(formData.content, formData.type, tags, metadata);
      }

      // Reset form
      setFormData({ content: '', type: 'note', tags: '', source: '', context: '' });
      setShowAddForm(false);
      setEditingId(null);
      loadMemories();
    } catch (error) {
      console.error('Failed to save memory:', error);
      alert('Failed to save memory');
    }
  };

  const handleEdit = (memory: Memory) => {
    setFormData({
      content: memory.content,
      type: memory.type,
      tags: memory.tags.join(', '),
      source: memory.metadata?.source || '',
      context: memory.metadata?.context || '',
    });
    setEditingId(memory.memoryId);
    setShowAddForm(true);
  };

  const handleDelete = async (memoryId: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;

    try {
      await api.deleteMemory(memoryId);
      loadMemories();
    } catch (error) {
      console.error('Failed to delete memory:', error);
      alert('Failed to delete memory');
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'motivational': return 'bg-purple-100 text-purple-800';
      case 'sad': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Memories</h1>
              <p className="text-gray-600 mt-1">Store notes, quotes, and important memories</p>
            </div>
            <Button onClick={() => {
              setFormData({ content: '', type: 'note', tags: '', source: '', context: '' });
              setEditingId(null);
              setShowAddForm(!showAddForm);
            }}>
              {showAddForm ? '✕ Cancel' : '+ Add Memory'}
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search memories..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Types</option>
              <option value="note">Notes</option>
              <option value="quote">Quotes</option>
              <option value="memory">Memories</option>
              <option value="reminder">Reminders</option>
              <option value="thought">Thoughts</option>
            </select>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Memory' : 'Add New Memory'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="note">Note</option>
                  <option value="quote">Quote</option>
                  <option value="memory">Memory</option>
                  <option value="reminder">Reminder</option>
                  <option value="thought">Thought</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={4}
                  placeholder="Enter your note, quote, or memory..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source (e.g., "dad", "book")</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="Who or what is this from?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="motivation, family, wisdom"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Context (optional)</label>
                <input
                  type="text"
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  placeholder="When or why is this important?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Update Memory' : 'Save Memory'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFormData({ content: '', type: 'note', tags: '', source: '', context: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Memories Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading memories...</p>
          </div>
        ) : memories.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-2">No memories yet</p>
            <p className="text-sm text-gray-400">Click "Add Memory" to create your first one!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memories.map((memory) => (
              <Card key={memory.memoryId} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {memory.type}
                    </span>
                    {memory.sentiment && (
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getSentimentColor(memory.sentiment)}`}>
                        {memory.sentiment}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(memory)}
                      className="text-gray-400 hover:text-blue-600 p-1"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(memory.memoryId)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <p className="text-gray-900 whitespace-pre-wrap mb-3">{memory.content}</p>

                {memory.metadata?.source && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Source:</span> {memory.metadata.source}
                  </p>
                )}

                {memory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {memory.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  {new Date(memory.createdAt).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
