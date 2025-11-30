import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { generateInsights } from '../utils/insights';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Insights() {
  const navigate = useNavigate();
  const { scores } = useStore();

  useEffect(() => {
    if (!scores) {
      navigate('/questionnaire');
    }
  }, [scores, navigate]);

  if (!scores) {
    return null;
  }

  const insights = generateInsights(scores);

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
            Your Thinking Profile
          </h1>
          <p className="text-lg text-muted-foreground">
            Personalized insights based on your cognitive fingerprint
          </p>
        </motion.div>

        {/* Top Traits Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Your Dominant Traits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(scores)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([trait, score], index) => (
                    <motion.div
                      key={trait}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
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

        {/* Insights Cards */}
        <div className="space-y-6">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid={`insight-card-${index}`}>
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
          <Button
            size="lg"
            onClick={() => navigate('/export')}
            data-testid="export-profile-btn"
          >
            Export & Share Profile
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
