import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { api } from '../utils/api';
import { QuestionCard } from '../components/core/QuestionCard';
import { ProgressBar } from '../components/core/ProgressBar';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export function Questionnaire() {
  const navigate = useNavigate();
  const {
    questions,
    setQuestions,
    answers,
    setAnswer,
    currentQuestionIndex,
    setCurrentQuestionIndex,
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await api.getQuestions();
        setQuestions(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load questions. Please try again.');
        setIsLoading(false);
      }
    };

    if (questions.length === 0) {
      loadQuestions();
    } else {
      setIsLoading(false);
    }
  }, [questions.length, setQuestions]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = currentQuestionIndex + 1;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const canGoNext = answers[currentQuestion?.id];
  const canGoPrevious = currentQuestionIndex > 0;
  const allAnswered = Object.keys(answers).length === totalQuestions;

  const handleNext = () => {
    if (isLastQuestion && allAnswered) {
      navigate('/processing');
    } else if (canGoNext && currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSelectChoice = (choiceId: string) => {
    setAnswer(currentQuestion.id, choiceId);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Progress Bar */}
        <ProgressBar current={progress} total={totalQuestions} />

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          selectedChoice={answers[currentQuestion?.id] || null}
          onSelectChoice={handleSelectChoice}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            data-testid="previous-btn"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {Object.keys(answers).length} of {totalQuestions} answered
          </div>

          <Button
            onClick={handleNext}
            disabled={!canGoNext}
            data-testid="next-btn"
          >
            {isLastQuestion && allAnswered ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
