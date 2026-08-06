import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Header } from '../components/core/Header';
import { Footer } from '../components/core/Footer';

export default function PairingAnalysis() {
  const [searchParams] = useSearchParams();
  const profileId1 = searchParams.get('profile1');
  const profileId2 = searchParams.get('profile2');
  const navigate = useNavigate();
  
  const [pairing, setPairing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePairing = async () => {
    if (!profileId1 || !profileId2) return;

    try {
      setLoading(true);
      setError(null);
      const data = await api.analyzePairing(profileId1, profileId2);
      setPairing(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId1 && profileId2) {
      analyzePairing();
    }
  }, [profileId1, profileId2]);

  if (!profileId1 || !profileId2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Missing Profile IDs</h2>
            <p className="text-gray-600 mb-6">Please provide both profile1 and profile2 parameters</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Analyzing cognitive pairing...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!pairing) {
    return null;
  }

  const { compatibilityScore, alignmentMetrics, complementarityScore, frictionZones, strengths, interactionModel, recommendations } = pairing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Cognitive Pairing Analysis
          </h1>
          <p className="text-gray-600 text-lg">
            Understanding collaboration dynamics between two cognitive profiles
          </p>
        </div>

        {/* Overall Scores */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold mb-2">Compatibility Score</h3>
            <div className="text-5xl font-bold text-indigo-600 mb-2">
              {compatibilityScore.toFixed(0)}
              <span className="text-2xl text-gray-500">/100</span>
            </div>
            <p className="text-sm text-gray-600">
              {compatibilityScore > 75 ? '🎯 Excellent alignment' : 
               compatibilityScore > 50 ? '✓ Good compatibility' : 
               '⚠️ Requires effort'}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
            <h3 className="text-lg font-semibold mb-2">Complementarity Score</h3>
            <div className="text-5xl font-bold text-purple-600 mb-2">
              {complementarityScore.toFixed(0)}
              <span className="text-2xl text-gray-500">/100</span>
            </div>
            <p className="text-sm text-gray-600">
              {complementarityScore > 50 ? '⭐ Strong synergy potential' : 
               complementarityScore > 25 ? '○ Some complementary traits' : 
               '◇ Similar profiles'}
            </p>
          </Card>
        </div>

        {/* Interaction Model */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-emerald-50 to-green-50">
          <h2 className="text-2xl font-bold mb-3 text-green-900">Interaction Model</h2>
          <p className="text-lg text-gray-700">{interactionModel}</p>
        </Card>

        {/* Alignment Metrics */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Alignment Metrics</h2>
          <div className="space-y-4">
            {Object.entries(alignmentMetrics).map(([metric, score]: [string, any]) => (
              <div key={metric}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium capitalize">
                    {metric.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-gray-600">{score.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      score > 75 ? 'bg-green-500' : 
                      score > 50 ? 'bg-blue-500' : 
                      score > 25 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Strengths */}
        {strengths.length > 0 && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <h2 className="text-2xl font-bold mb-4 text-green-900">Collaborative Strengths</h2>
            <div className="space-y-3">
              {strengths.map((strength: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold">{strength.area}</span>
                    <span className="text-green-600 font-bold">{strength.score.toFixed(0)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{strength.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Friction Zones */}
        {frictionZones.length > 0 && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <h2 className="text-2xl font-bold mb-4 text-orange-900">Potential Friction Zones</h2>
            <div className="space-y-3">
              {frictionZones.map((friction: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-orange-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold capitalize">
                      {friction.trait.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      friction.severity > 75 ? 'bg-red-100 text-red-700' :
                      friction.severity > 50 ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      Severity: {friction.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{friction.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recommendations */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold mb-4 text-indigo-900">Recommendations</h2>
          <ul className="space-y-3">
            {recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex gap-3">
                <span className="text-indigo-600 font-bold">•</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex gap-4">
          <Button onClick={() => navigate(`/profile/${profileId1}`)}>
            View Profile 1
          </Button>
          <Button onClick={() => navigate(`/profile/${profileId2}`)}>
            View Profile 2
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Home
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
