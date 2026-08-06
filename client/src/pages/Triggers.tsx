import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Header } from '../components/core/Header';
import { Footer } from '../components/core/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface Trigger {
  triggerId: string;
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
}

interface Memory {
  memoryId: string;
  content: string;
  type: string;
}

export function Triggers() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    keywords: '',
    sentiments: [] as string[],
    patterns: '',
    content: '',
    memoryIds: [] as string[],
    priority: 5,
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [triggersData, memoriesData] = await Promise.all([
        api.getTriggers(),
        api.getMemories({}),
      ]);
      setTriggers(triggersData);
      setMemories(memoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const keywords = formData.keywords.split(',').map(k => k.trim()).filter(k => k);
      const patterns = formData.patterns.split(',').map(p => p.trim()).filter(p => p);

      const triggerData = {
        name: formData.name,
        description: formData.description,
        triggerConditions: {
          keywords,
          sentiments: formData.sentiments,
          patterns,
        },
        responses: [{
          content: formData.content,
          memoryIds: formData.memoryIds,
        }],
        priority: formData.priority,
      };

      if (editingId) {
        await api.updateTrigger(editingId, triggerData);
      } else {
        await api.createTrigger(triggerData);
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        keywords: '',
        sentiments: [],
        patterns: '',
        content: '',
        memoryIds: [],
        priority: 5,
      });
      setShowAddForm(false);
      setEditingId(null);
      loadData();
    } catch (error) {
      console.error('Failed to save trigger:', error);
      alert('Failed to save trigger');
    }
  };

  const handleEdit = (trigger: Trigger) => {
    const response = trigger.responses[0] || { content: '', memoryIds: [] };
    setFormData({
      name: trigger.name,
      description: trigger.description || '',
      keywords: trigger.triggerConditions.keywords.join(', '),
      sentiments: trigger.triggerConditions.sentiments,
      patterns: trigger.triggerConditions.patterns.join(', '),
      content: response.content,
      memoryIds: response.memoryIds,
      priority: trigger.priority,
    });
    setEditingId(trigger.triggerId);
    setShowAddForm(true);
  };

  const handleToggle = async (triggerId: string) => {
    try {
      await api.toggleTrigger(triggerId);
      loadData();
    } catch (error) {
      console.error('Failed to toggle trigger:', error);
    }
  };

  const handleDelete = async (triggerId: string) => {
    if (!confirm('Are you sure you want to delete this trigger?')) return;

    try {
      await api.deleteTrigger(triggerId);
      loadData();
    } catch (error) {
      console.error('Failed to delete trigger:', error);
      alert('Failed to delete trigger');
    }
  };

  const toggleSentiment = (sentiment: string) => {
    setFormData({
      ...formData,
      sentiments: formData.sentiments.includes(sentiment)
        ? formData.sentiments.filter(s => s !== sentiment)
        : [...formData.sentiments, sentiment],
    });
  };

  const toggleMemory = (memoryId: string) => {
    setFormData({
      ...formData,
      memoryIds: formData.memoryIds.includes(memoryId)
        ? formData.memoryIds.filter(id => id !== memoryId)
        : [...formData.memoryIds, memoryId],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Context Triggers</h1>
              <p className="text-gray-600 mt-1">Configure automatic responses based on keywords and emotions</p>
            </div>
            <Button onClick={() => {
              setFormData({
                name: '',
                description: '',
                keywords: '',
                sentiments: [],
                patterns: '',
                content: '',
                memoryIds: [],
                priority: 5,
              });
              setEditingId(null);
              setShowAddForm(!showAddForm);
            }}>
              {showAddForm ? '✕ Cancel' : '+ Add Trigger'}
            </Button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Trigger' : 'Create New Trigger'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Dad's Motivational Quotes"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What does this trigger do?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="depressed, sad, down, hopeless"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sentiments to Match</label>
                <div className="flex flex-wrap gap-2">
                  {['positive', 'negative', 'neutral', 'motivational', 'sad'].map((sentiment) => (
                    <button
                      key={sentiment}
                      type="button"
                      onClick={() => toggleSentiment(sentiment)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        formData.sentiments.includes(sentiment)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {sentiment}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Message</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={3}
                  placeholder="This will be shown to the user along with selected memories"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Memories ({formData.memoryIds.length} selected)
                </label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                  {memories.length === 0 ? (
                    <p className="text-sm text-gray-500">No memories available. Create some first!</p>
                  ) : (
                    memories.map((memory) => (
                      <div
                        key={memory.memoryId}
                        className={`p-3 rounded cursor-pointer ${
                          formData.memoryIds.includes(memory.memoryId)
                            ? 'bg-purple-50 border-2 border-purple-500'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                        onClick={() => toggleMemory(memory.memoryId)}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={formData.memoryIds.includes(memory.memoryId)}
                            onChange={() => toggleMemory(memory.memoryId)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <span className="text-xs font-medium text-purple-600">{memory.type}</span>
                            <p className="text-sm text-gray-900 line-clamp-2">{memory.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Update Trigger' : 'Create Trigger'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Triggers List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading triggers...</p>
          </div>
        ) : triggers.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-2">No triggers yet</p>
            <p className="text-sm text-gray-400">Create your first trigger to enable context-aware responses!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {triggers.map((trigger) => (
              <Card key={trigger.triggerId} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{trigger.name}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        trigger.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {trigger.isActive ? '✓ Active' : '✕ Inactive'}
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        Priority: {trigger.priority}
                      </span>
                    </div>
                    {trigger.description && (
                      <p className="text-sm text-gray-600 mb-3">{trigger.description}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(trigger.triggerId)}
                      className="text-gray-400 hover:text-green-600 p-2"
                      title={trigger.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {trigger.isActive ? '⏸️' : '▶️'}
                    </button>
                    <button
                      onClick={() => handleEdit(trigger)}
                      className="text-gray-400 hover:text-blue-600 p-2"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(trigger.triggerId)}
                      className="text-gray-400 hover:text-red-600 p-2"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {trigger.triggerConditions.keywords.length > 0 ? (
                        trigger.triggerConditions.keywords.map((kw, idx) => (
                          <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-700 mb-1">Sentiments:</p>
                    <div className="flex flex-wrap gap-1">
                      {trigger.triggerConditions.sentiments.length > 0 ? (
                        trigger.triggerConditions.sentiments.map((s, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </div>
                  </div>
                </div>

                {trigger.responses[0] && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-900 mb-2">
                      <span className="font-medium">Response:</span> {trigger.responses[0].content || 'No message'}
                    </p>
                    <p className="text-xs text-gray-600">
                      Linked to {trigger.responses[0].memoryIds.length} memories
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
