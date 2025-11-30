export interface Question {
  id: string;
  title: string;
  scenario: string;
  choices: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  scores: TraitScores;
}

export interface TraitScores {
  analytical?: number;
  intuitionDriven?: number;
  sequential?: number;
  improviser?: number;
  riskNeutral?: number;
  comfortSeeker?: number;
  clarityFirst?: number;
  fastDecider?: number;
  overthinker?: number;
  patternSeeker?: number;
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

export interface Profile {
  id: string;
  scores: FinalScores;
  answers: UserAnswer[];
  createdAt: Date;
}

export interface ScoreRequest {
  answers: UserAnswer[];
}

export interface ScoreResponse {
  scores: FinalScores;
  correlations: TraitCorrelation[];
}

export interface TraitCorrelation {
  trait1: string;
  trait2: string;
  strength: number;
}

export interface SaveProfileRequest {
  scores: FinalScores;
  answers: UserAnswer[];
}

export interface SaveProfileResponse {
  profileId: string;
  shareUrl: string;
}