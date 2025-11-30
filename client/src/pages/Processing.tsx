import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { api } from '../utils/api';
import { Brain, Loader2 } from 'lucide-react';

export function Processing() {
  const navigate = useNavigate();
  const { answers, questions, setScores } = useStore();
  const [status, setStatus] = useState('Analyzing your responses...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAnswers = async () => {
      try {
        // Convert answers object to array format
        const answersArray = Object.entries(answers).map(([questionId, choiceId]) => ({
          questionId,
          choiceId,
        }));

        if (answersArray.length === 0) {
          navigate('/questionnaire');
          return;
        }

        // Step 1: Calculate scores
        setStatus('Calculating your cognitive scores...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const scoreData = await api.calculateScores(answersArray);
        setScores(scoreData.scores, scoreData.correlations);

        // Step 2: Generate insights
        setStatus('Generating personalized insights...');
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Step 3: Building graph
        setStatus('Creating your thinking graph...');
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Navigate to graph view
        navigate('/graph');
      } catch (err) {
        console.error('Processing error:', err);
        setError('Failed to process your answers. Please try again.');
      }
    };

    processAnswers();
  }, [answers, navigate, setScores]);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/questionnaire')}
            className="text-primary hover:underline"
          >
            Go back to questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
        >
          <Brain className="w-12 h-12 text-white" />
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Processing Your Profile</h2>
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg text-muted-foreground"
          >
            {status}
          </motion.p>
        </div>

        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    </div>
  );
}
