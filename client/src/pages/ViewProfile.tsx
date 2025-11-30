import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { generateInsights } from '../utils/insights';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2, Home } from 'lucide-react';
import { FinalScores } from '../store/useStore';

export function ViewProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) {
        setError('Invalid profile ID');
        setIsLoading(false);
        return;
      }

      try {
        const data = await api.getProfile(id);
        setProfile(data);
        setIsLoading(false);
      } catch (err) {
        setError('Profile not found');
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-xl text-muted-foreground">{error || 'Profile not found'}</p>
          <Button onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const insights = generateInsights(profile.scores as FinalScores);

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Cognitive Profile
          </h1>
          <p className="text-sm text-muted-foreground">Profile ID: {profile.id}</p>
          <p className="text-sm text-muted-foreground">
            Created: {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </motion.div>

        {/* Trait Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Cognitive Traits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(profile.scores)
                  .sort(([, a]: any, [, b]: any) => b - a)
                  .map(([trait, score]: any, index: number) => (
                    <motion.div
                      key={trait}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50"
                    >
                      <div className="text-2xl font-bold text-primary">{score}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {trait.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Insights */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Profile Insights</h2>
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{insight.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-primary uppercase tracking-wide mb-1">
                        {insight.category}
                      </div>
                      <CardTitle className="text-xl">{insight.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pt-4"
        >
          <Button onClick={() => navigate('/')} size="lg">
            <Home className="w-4 h-4 mr-2" />
            Create Your Own Profile
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
