import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Header } from '../components/core/Header';
import { Footer } from '../components/core/Footer';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Evolution() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const navigate = useNavigate();
  
  const [evolutionData, setEvolutionData] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [evolution, summaryData] = await Promise.all([
          api.getEvolutionData(userId),
          api.getEvolutionSummary(userId),
        ]);
        setEvolutionData(evolution);
        setSummary(summaryData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Missing User ID</h2>
            <p className="text-gray-600 mb-6">Please provide a userId parameter</p>
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
          <div className="text-xl text-gray-600">Loading evolution data...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !evolutionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error || 'Failed to load evolution data'}</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Prepare chart data
  const chartData = evolutionData.timeSeries.dates.map((date: string, index: number) => {
    const dataPoint: any = {
      date: new Date(date).toLocaleDateString(),
    };
    
    Object.keys(evolutionData.timeSeries.traits).forEach(trait => {
      dataPoint[trait] = evolutionData.timeSeries.traits[trait][index];
    });
    
    return dataPoint;
  });

  const traits = Object.keys(evolutionData.timeSeries.traits);
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
    '#d084d0', '#a4de6c', '#ffbb28', '#ff8042', '#0088fe'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Cognitive Evolution Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Track how your cognitive patterns change over time
          </p>
        </div>

        {/* Summary Card */}
        {summary && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-bold mb-4">Evolution Summary</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-indigo-600">{summary.totalSessions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Trend</p>
                <p className="text-2xl font-bold capitalize">
                  {summary.overallTrend === 'stable' ? '🎯 ' : 
                   summary.overallTrend === 'evolving' ? '📈 ' : 
                   '🚀 '}
                  {summary.overallTrend}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">First Session</p>
                <p className="text-lg font-semibold">
                  {new Date(summary.firstSessionDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Latest Session</p>
                <p className="text-lg font-semibold">
                  {new Date(summary.lastSessionDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Drift Analysis */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Cognitive Drift Analysis</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Most Stable Traits</h3>
              <ul className="space-y-1">
                {summary?.mostStableTraits.map((trait: string) => (
                  <li key={trait} className="text-sm capitalize">
                    ✓ {trait.replace(/([A-Z])/g, ' $1')}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-orange-700 mb-2">Most Volatile Traits</h3>
              <ul className="space-y-1">
                {summary?.mostVolatileTraits.map((trait: string) => (
                  <li key={trait} className="text-sm capitalize">
                    ⚡ {trait.replace(/([A-Z])/g, ' $1')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Overall Stability: <strong>{evolutionData.driftAnalysis.stability.toFixed(1)}/100</strong>
            </p>
          </div>
        </Card>

        {/* Time Series Chart */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Cognitive Traits Over Time</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              {traits.slice(0, 5).map((trait, index) => (
                <Line
                  key={trait}
                  type="monotone"
                  dataKey={trait}
                  stroke={colors[index]}
                  strokeWidth={2}
                  name={trait.replace(/([A-Z])/g, ' $1')}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Change Velocity */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Change Velocity</h2>
          <p className="text-gray-600 mb-4">Average change per session for each trait</p>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(evolutionData.changeVelocity).map(([trait, velocity]: [string, any]) => (
              <div key={trait} className="flex justify-between items-center">
                <span className="capitalize text-sm">{trait.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-semibold">
                  {velocity.toFixed(2)} pts/session
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </main>

      <Footer />
    </div>
  );
}
