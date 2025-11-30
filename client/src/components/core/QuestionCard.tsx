import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';
import { Question } from '../../store/useStore';

interface QuestionCardProps {
  question: Question;
  selectedChoice: string | null;
  onSelectChoice: (choiceId: string) => void;
}

export function QuestionCard({ question, selectedChoice, onSelectChoice }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{question.title}</CardTitle>
          <CardDescription className="text-base mt-3 leading-relaxed">
            {question.scenario}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.choices.map((choice, index) => (
            <motion.div
              key={choice.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant={selectedChoice === choice.id ? 'default' : 'outline'}
                className="w-full text-left h-auto py-4 px-5 justify-start relative group"
                onClick={() => onSelectChoice(choice.id)}
                data-testid={`choice-${choice.id}`}
              >
                <span className="flex-1 text-sm leading-relaxed">{choice.text}</span>
                {selectedChoice === choice.id && (
                  <Check className="w-5 h-5 ml-3 flex-shrink-0" />
                )}
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}