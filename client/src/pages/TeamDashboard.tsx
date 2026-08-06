import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Header } from '../components/core/Header';
import { Footer } from '../components/core/Footer';

export default function TeamDashboard() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const data = await api.getTeamAnalysis(teamId);
        setAnalysis(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [teamId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading team analysis...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error || 'Failed to load team analysis'}</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const { team, diversityHeatmap, synergyMatrix, strengthDistribution, conflictPredictions, recommendations } = analysis;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {team.name}
          </h1>
          {team.description && <p className="text-gray-600 text-lg">{team.description}</p>}
          <p className="text-sm text-gray-500 mt-2">
            {team.memberProfiles.length} team members • Created {new Date(team.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Team Overview */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold mb-4">Team Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Team Size</p>
              <p className="text-3xl font-bold text-indigo-600">{team.memberProfiles.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Diversity Score</p>
              <p className="text-3xl font-bold text-purple-600">
                {team.diversityMetrics.overallDiversity.toFixed(0)}/100
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Team Balance</p>
              <p className="text-2xl font-bold">
                {team.diversityMetrics.overallDiversity > 60 ? '🌈 Highly Diverse' : 
                 team.diversityMetrics.overallDiversity > 30 ? '⚖️ Balanced' : 
                 '🎯 Aligned'}
              </p>
            </div>
          </div>
        </Card>

        {/* Diversity Heatmap */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Cognitive Diversity Heatmap</h2>
          <p className="text-gray-600 mb-4">Variance in cognitive traits across team members</p>
          <div className="space-y-3">
            {Object.entries(diversityHeatmap).map(([trait, variance]: [string, any]) => {
              const normalized = Math.min(100, variance * 2);
              return (
                <div key={trait}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium capitalize">{trait.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-gray-600">
                      {normalized > 60 ? 'High' : normalized > 30 ? 'Medium' : 'Low'} diversity
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        normalized > 60 ? 'bg-green-500' : 
                        normalized > 30 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${normalized}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Strength Distribution */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Strength Distribution</h2>
          <p className="text-gray-600 mb-4">How many team members excel in each cognitive area</p>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(strengthDistribution).map(([trait, dist]: [string, any]) => (
              <div key={trait} className="border rounded-lg p-4">
                <h3 className="font-semibold capitalize mb-2">{trait.replace(/([A-Z])/g, ' $1')}</h3>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">✓ Strong: {dist.strong}</span>
                  <span className="text-yellow-600">○ Moderate: {dist.moderate}</span>
                  <span className="text-red-600">△ Weak: {dist.weak}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Synergy Matrix */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Team Synergy Matrix</h2>
          <p className="text-gray-600 mb-4">Complementarity scores between team members</p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {synergyMatrix.slice(0, 10).map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="text-sm">
                  <span className="font-mono text-xs">{item.member1}</span>
                  {' + '}
                  <span className="font-mono text-xs">{item.member2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.synergyScore > 60 ? 'bg-green-500' : 
                        item.synergyScore > 30 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${item.synergyScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-12">{item.synergyScore.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Conflict Predictions */}
        {conflictPredictions.length > 0 && (
          <Card className="p-6 mb-6 border-orange-200 bg-orange-50">
            <h2 className="text-2xl font-bold mb-4 text-orange-900">Potential Friction Zones</h2>
            <div className="space-y-3">
              {conflictPredictions.map((conflict: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-orange-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold capitalize">{conflict.trait.replace(/([A-Z])/g, ' $1')}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      conflict.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                      conflict.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {conflict.riskLevel} risk
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{conflict.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recommendations */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50">
          <h2 className="text-2xl font-bold mb-4 text-green-900">Team Recommendations</h2>
          <ul className="space-y-3">
            {recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex gap-3">
                <span className="text-green-600 font-bold">→</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </main>

      <Footer />
    </div>
  );
}
