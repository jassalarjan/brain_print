import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Header } from '../components/core/Header';
import { Footer } from '../components/core/Footer';

export default function Benchmark() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [benchmark, setBenchmark] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) return;

    const fetchBenchmark = async () => {
      try {
        setLoading(true);
        const data = await api.getBenchmark(profileId);
        setBenchmark(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBenchmark();
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading benchmark data...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !benchmark) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error || 'Failed to load benchmark data'}</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const { percentiles, divergenceScore, archetype, globalComparison } = benchmark;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Cognitive Benchmark Analysis
          </h1>
          <p className="text-gray-600 text-lg">
            See how you compare to the global population
          </p>
        </div>

        {/* Archetype Card */}
        {archetype && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <h2 className="text-2xl font-bold text-purple-900 mb-2">
              Your Cognitive Archetype: {archetype}
            </h2>
            <p className="text-gray-700">
              You've been identified as a <strong>{archetype}</strong> thinker based on your trait patterns.
            </p>
          </Card>
        )}

        {/* Divergence Score */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Divergence Score</h2>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-indigo-600">{divergenceScore.toFixed(2)}</div>
            <div className="text-gray-600">
              <p>How unique your cognitive profile is compared to the average person.</p>
              <p className="text-sm mt-2">
                {divergenceScore < 2 ? '🎯 Very typical' : 
                 divergenceScore < 4 ? '📊 Moderately unique' : 
                 '⭐ Highly distinctive'}
              </p>
            </div>
          </div>
        </Card>

        {/* Percentile Rankings */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Percentile Rankings</h2>
          <p className="text-gray-600 mb-4">Your position compared to the global dataset (0-100th percentile)</p>
          
          <div className="space-y-3">
            {Object.entries(percentiles).map(([trait, percentile]: [string, any]) => (
              <div key={trait}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium capitalize">{trait.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-gray-600">{percentile.toFixed(0)}th percentile</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      percentile > 75 ? 'bg-green-500' : 
                      percentile > 50 ? 'bg-blue-500' : 
                      percentile > 25 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${percentile}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Global Comparison */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Global Comparison</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Above Average</h3>
              <ul className="space-y-1">
                {globalComparison.aboveAverage.map((trait: string) => (
                  <li key={trait} className="text-sm capitalize">
                    ✓ {trait.replace(/([A-Z])/g, ' $1')}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-orange-700 mb-2">Below Average</h3>
              <ul className="space-y-1">
                {globalComparison.belowAverage.map((trait: string) => (
                  <li key={trait} className="text-sm capitalize">
                    ↓ {trait.replace(/([A-Z])/g, ' $1')}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-purple-700 mb-2">Extreme Traits</h3>
              <ul className="space-y-1">
                {globalComparison.extremeTraits.map((trait: string) => (
                  <li key={trait} className="text-sm capitalize">
                    ⭐ {trait.replace(/([A-Z])/g, ' $1')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button onClick={() => navigate(`/profile/${profileId}`)}>
            View Full Profile
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
