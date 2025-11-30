import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Brain, Zap, Share2, Download } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Personal Context Engine
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Map how you think, not who you are.
          </p>
          
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Discover your unique cognitive fingerprint through scenario-based questions.
            Understand your decision-making patterns, learning style, and thinking preferences.
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6 h-auto"
              onClick={() => navigate('/questionnaire')}
              data-testid="start-context-btn"
            >
              Start Context Session
            </Button>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6 mt-16"
        >
          <Card className="border-2 hover:border-primary/50 transition">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">Interactive Assessment</h3>
              <p className="text-sm text-muted-foreground">
                12 scenario-based questions that reveal your natural thinking patterns
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">Cognitive Graph</h3>
              <p className="text-sm text-muted-foreground">
                Visualize your thinking fingerprint with an interactive, animated graph
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-cyan-100 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-lg">Share & Export</h3>
              <p className="text-sm text-muted-foreground">
                Get a shareable link and export your profile as JSON
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}