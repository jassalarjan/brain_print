import { create } from 'zustand';

export interface Question {
  id: string;
  title: string;
  scenario: string;
  choices: Choice[];
}

export interface Choice {
  id: string;
  text: string;
}

export interface UserAnswer {
  questionId: string;
  choiceId: string;
}

export interface FinalScores {
  analytical: number;
  intuitionDriven: number;
  sequential: number;
  improviser: number;
  riskNeutral: number;
  comfortSeeker: number;
  clarityFirst: number;
  fastDecider: number;
  overthinker: number;
  patternSeeker: number;
}

export interface TraitCorrelation {
  trait1: string;
  trait2: string;
  strength: number;
}

export interface Profile {
  id: string;
  scores: FinalScores;
  answers: UserAnswer[];
  createdAt: string;
}

interface StoreState {
  // Questions
  questions: Question[];
  setQuestions: (questions: Question[]) => void;

  // Answers
  answers: Record<string, string>; // questionId -> choiceId
  setAnswer: (questionId: string, choiceId: string) => void;
  clearAnswers: () => void;

  // Current question index
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;

  // Scores
  scores: FinalScores | null;
  correlations: TraitCorrelation[];
  setScores: (scores: FinalScores, correlations: TraitCorrelation[]) => void;

  // Profile
  profileId: string | null;
  shareUrl: string | null;
  setProfile: (profileId: string, shareUrl: string) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Reset
  reset: () => void;
}

export const useStore = create<StoreState>((set) => ({
  // Questions
  questions: [],
  setQuestions: (questions) => set({ questions }),

  // Answers
  answers: {},
  setAnswer: (questionId, choiceId) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: choiceId },
    })),
  clearAnswers: () => set({ answers: {} }),

  // Current question index
  currentQuestionIndex: 0,
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  // Scores
  scores: null,
  correlations: [],
  setScores: (scores, correlations) => set({ scores, correlations }),

  // Profile
  profileId: null,
  shareUrl: null,
  setProfile: (profileId, shareUrl) => set({ profileId, shareUrl }),

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Reset
  reset: () =>
    set({
      answers: {},
      currentQuestionIndex: 0,
      scores: null,
      correlations: [],
      profileId: null,
      shareUrl: null,
      isLoading: false,
    }),
}));
