import { UserAnswer, FinalScores, TraitCorrelation, TraitScores } from '../types';
import { questions } from './questions.service';

export class ScoringService {
  calculateScores(answers: UserAnswer[]): FinalScores {
    // Initialize all traits to 0
    const traitTotals: FinalScores = {
      analytical: 0,
      intuitionDriven: 0,
      sequential: 0,
      improviser: 0,
      riskNeutral: 0,
      comfortSeeker: 0,
      clarityFirst: 0,
      fastDecider: 0,
      overthinker: 0,
      patternSeeker: 0,
    };

    // Accumulate scores from each answer
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) return;

      const choice = question.choices.find(c => c.id === answer.choiceId);
      if (!choice) return;

      // Add scores from this choice
      Object.entries(choice.scores).forEach(([trait, score]) => {
        if (trait in traitTotals) {
          traitTotals[trait as keyof FinalScores] += score;
        }
      });
    });

    // Normalize scores to 0-100 scale
    // Maximum possible score per trait is roughly 15 points * 12 questions = 180
    // But in practice, users will score much lower since they pick one choice per question
    const maxObserved = Math.max(...Object.values(traitTotals));
    const minObserved = Math.min(...Object.values(traitTotals));
    
    const normalizedScores: FinalScores = {} as FinalScores;
    
    Object.entries(traitTotals).forEach(([trait, score]) => {
      // Normalize to 0-100, with a floor of 10 to avoid zeros
      const range = maxObserved - minObserved;
      const normalized = range > 0 
        ? ((score - minObserved) / range) * 80 + 10 
        : 50;
      
      normalizedScores[trait as keyof FinalScores] = Math.round(normalized);
    });

    return normalizedScores;
  }

  calculateCorrelations(scores: FinalScores): TraitCorrelation[] {
    const traits = Object.keys(scores) as (keyof FinalScores)[];
    const correlations: TraitCorrelation[] = [];

    // Define meaningful trait pairs that should be correlated
    const correlationPairs: { trait1: keyof FinalScores; trait2: keyof FinalScores; type: 'positive' | 'negative' }[] = [
      { trait1: 'analytical', trait2: 'overthinker', type: 'positive' },
      { trait1: 'analytical', trait2: 'intuitionDriven', type: 'negative' },
      { trait1: 'sequential', trait2: 'improviser', type: 'negative' },
      { trait1: 'sequential', trait2: 'clarityFirst', type: 'positive' },
      { trait1: 'improviser', trait2: 'fastDecider', type: 'positive' },
      { trait1: 'riskNeutral', trait2: 'comfortSeeker', type: 'negative' },
      { trait1: 'patternSeeker', trait2: 'analytical', type: 'positive' },
      { trait1: 'intuitionDriven', trait2: 'improviser', type: 'positive' },
      { trait1: 'overthinker', trait2: 'fastDecider', type: 'negative' },
      { trait1: 'clarityFirst', trait2: 'analytical', type: 'positive' },
    ];

    correlationPairs.forEach(pair => {
      const score1 = scores[pair.trait1];
      const score2 = scores[pair.trait2];

      // Calculate correlation strength based on scores
      let strength: number;
      
      if (pair.type === 'positive') {
        // Both high or both low = strong correlation
        const avg = (score1 + score2) / 2;
        const diff = Math.abs(score1 - score2);
        strength = (avg / 100) * (1 - diff / 100);
      } else {
        // One high, one low = strong negative correlation
        const diff = Math.abs(score1 - score2);
        const maxScore = Math.max(score1, score2);
        strength = (diff / 100) * (maxScore / 100);
      }

      // Only include significant correlations
      if (strength > 0.3) {
        correlations.push({
          trait1: this.formatTraitName(pair.trait1),
          trait2: this.formatTraitName(pair.trait2),
          strength: Math.round(strength * 100) / 100,
        });
      }
    });

    // Sort by strength
    return correlations.sort((a, b) => b.strength - a.strength);
  }

  private formatTraitName(trait: string): string {
    // Convert camelCase to Title Case
    return trait.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
}

export const scoringService = new ScoringService();
