import { Question } from '../types';

export const questions: Question[] = [
  {
    id: 'q1',
    title: 'Project Deadline Approach',
    scenario: 'You\'re leading a team project with a tight deadline. Halfway through, you realize the original plan won\'t work. What\'s your instinct?',
    choices: [
      {
        id: 'q1c1',
        text: 'Analyze what went wrong, create a detailed new plan with clear milestones',
        scores: {
          analytical: 15,
          sequential: 12,
          clarityFirst: 10,
          overthinker: 8
        }
      },
      {
        id: 'q1c2',
        text: 'Trust your gut on a new direction and adapt as you go',
        scores: {
          intuitionDriven: 15,
          improviser: 14,
          fastDecider: 10,
          riskNeutral: 8
        }
      },
      {
        id: 'q1c3',
        text: 'Stick with the original plan but work harder to make it succeed',
        scores: {
          comfortSeeker: 12,
          sequential: 10,
          overthinker: 8
        }
      },
      {
        id: 'q1c4',
        text: 'Brainstorm with the team and implement the most creative solution quickly',
        scores: {
          improviser: 12,
          fastDecider: 10,
          intuitionDriven: 8,
          riskNeutral: 6
        }
      }
    ]
  },
  {
    id: 'q2',
    title: 'Learning New Skill',
    scenario: 'You want to learn a complex new skill (like coding, painting, or a language). How do you approach it?',
    choices: [
      {
        id: 'q2c1',
        text: 'Research thoroughly, create a structured learning plan, follow it step-by-step',
        scores: {
          sequential: 15,
          analytical: 12,
          clarityFirst: 10,
          patternSeeker: 8
        }
      },
      {
        id: 'q2c2',
        text: 'Jump in and learn by doing, figure things out as problems arise',
        scores: {
          improviser: 15,
          intuitionDriven: 12,
          fastDecider: 8,
          riskNeutral: 10
        }
      },
      {
        id: 'q2c3',
        text: 'Find patterns between this and what you already know, build mental models',
        scores: {
          patternSeeker: 15,
          analytical: 12,
          intuitionDriven: 8
        }
      },
      {
        id: 'q2c4',
        text: 'Take a beginner course to avoid mistakes, follow established methods',
        scores: {
          comfortSeeker: 12,
          sequential: 10,
          clarityFirst: 8
        }
      }
    ]
  },
  {
    id: 'q3',
    title: 'Major Life Decision',
    scenario: 'You\'re offered a dream job in a new city, but it means leaving your comfort zone. How do you decide?',
    choices: [
      {
        id: 'q3c1',
        text: 'Make a detailed pros/cons list, research extensively, take time to decide',
        scores: {
          analytical: 15,
          overthinker: 12,
          clarityFirst: 10,
          comfortSeeker: 6
        }
      },
      {
        id: 'q3c2',
        text: 'Go with your gut feeling about it',
        scores: {
          intuitionDriven: 15,
          fastDecider: 12,
          riskNeutral: 10
        }
      },
      {
        id: 'q3c3',
        text: 'Decide quickly - overthinking just creates anxiety',
        scores: {
          fastDecider: 15,
          riskNeutral: 10,
          improviser: 8
        }
      },
      {
        id: 'q3c4',
        text: 'Consider if it fits your long-term patterns and values, then decide',
        scores: {
          patternSeeker: 12,
          analytical: 10,
          clarityFirst: 8,
          overthinker: 8
        }
      }
    ]
  },
  {
    id: 'q4',
    title: 'Problem-Solving Style',
    scenario: 'Your car breaks down in an unfamiliar area. What\'s your first response?',
    choices: [
      {
        id: 'q4c1',
        text: 'Systematically check what could be wrong, diagnose methodically',
        scores: {
          analytical: 15,
          sequential: 12,
          clarityFirst: 8
        }
      },
      {
        id: 'q4c2',
        text: 'Try quick fixes based on intuition, see what works',
        scores: {
          improviser: 15,
          intuitionDriven: 12,
          fastDecider: 10
        }
      },
      {
        id: 'q4c3',
        text: 'Call for professional help immediately to avoid making it worse',
        scores: {
          comfortSeeker: 15,
          overthinker: 8,
          clarityFirst: 6
        }
      },
      {
        id: 'q4c4',
        text: 'Recall similar situations and apply what worked before',
        scores: {
          patternSeeker: 15,
          analytical: 10,
          sequential: 8
        }
      }
    ]
  },
  {
    id: 'q5',
    title: 'Team Collaboration',
    scenario: 'In a group brainstorming session, what role do you naturally take?',
    choices: [
      {
        id: 'q5c1',
        text: 'Organize ideas, create structure, ensure we stay on track',
        scores: {
          sequential: 15,
          analytical: 10,
          clarityFirst: 12
        }
      },
      {
        id: 'q5c2',
        text: 'Generate creative ideas rapidly, think outside the box',
        scores: {
          improviser: 15,
          intuitionDriven: 12,
          riskNeutral: 8
        }
      },
      {
        id: 'q5c3',
        text: 'Connect patterns between different ideas, synthesize concepts',
        scores: {
          patternSeeker: 15,
          analytical: 10,
          intuitionDriven: 8
        }
      },
      {
        id: 'q5c4',
        text: 'Evaluate feasibility, point out what might go wrong',
        scores: {
          analytical: 12,
          overthinker: 10,
          comfortSeeker: 8
        }
      }
    ]
  },
  {
    id: 'q6',
    title: 'Information Processing',
    scenario: 'You\'re reading a complex technical article. How do you process it?',
    choices: [
      {
        id: 'q6c1',
        text: 'Read linearly from start to finish, taking notes on key points',
        scores: {
          sequential: 15,
          analytical: 10,
          clarityFirst: 8
        }
      },
      {
        id: 'q6c2',
        text: 'Skim for the big picture first, dive deep into interesting parts',
        scores: {
          intuitionDriven: 12,
          improviser: 10,
          patternSeeker: 8
        }
      },
      {
        id: 'q6c3',
        text: 'Look for how it connects to things you already understand',
        scores: {
          patternSeeker: 15,
          analytical: 10,
          intuitionDriven: 6
        }
      },
      {
        id: 'q6c4',
        text: 'Read multiple times to ensure you grasp every detail',
        scores: {
          overthinker: 12,
          clarityFirst: 10,
          sequential: 8,
          analytical: 6
        }
      }
    ]
  },
  {
    id: 'q7',
    title: 'Risk Assessment',
    scenario: 'You have savings to invest. A friend pitches an exciting but risky startup opportunity. What do you do?',
    choices: [
      {
        id: 'q7c1',
        text: 'Research deeply: market analysis, competitor review, financial projections',
        scores: {
          analytical: 15,
          overthinker: 10,
          clarityFirst: 10,
          comfortSeeker: 6
        }
      },
      {
        id: 'q7c2',
        text: 'If it feels right and the friend is trustworthy, take the chance',
        scores: {
          intuitionDriven: 15,
          riskNeutral: 12,
          fastDecider: 10
        }
      },
      {
        id: 'q7c3',
        text: 'Stick with safer, proven investment options',
        scores: {
          comfortSeeker: 15,
          overthinker: 8,
          analytical: 6
        }
      },
      {
        id: 'q7c4',
        text: 'Decide quickly based on gut + quick research - too much analysis causes paralysis',
        scores: {
          fastDecider: 15,
          riskNeutral: 12,
          improviser: 8
        }
      }
    ]
  },
  {
    id: 'q8',
    title: 'Conflict Resolution',
    scenario: 'Two team members are in heated disagreement about project direction. How do you help?',
    choices: [
      {
        id: 'q8c1',
        text: 'Facilitate a structured discussion, analyze both viewpoints logically',
        scores: {
          analytical: 15,
          clarityFirst: 12,
          sequential: 8
        }
      },
      {
        id: 'q8c2',
        text: 'Use empathy and intuition to find common ground quickly',
        scores: {
          intuitionDriven: 15,
          fastDecider: 10,
          improviser: 8
        }
      },
      {
        id: 'q8c3',
        text: 'Identify underlying patterns in their concerns, address root causes',
        scores: {
          patternSeeker: 15,
          analytical: 12,
          clarityFirst: 8
        }
      },
      {
        id: 'q8c4',
        text: 'Suggest compromise to avoid prolonged conflict',
        scores: {
          comfortSeeker: 12,
          fastDecider: 10,
          overthinker: 6
        }
      }
    ]
  },
  {
    id: 'q9',
    title: 'Creative Challenge',
    scenario: 'You need to design a presentation for an important pitch. How do you start?',
    choices: [
      {
        id: 'q9c1',
        text: 'Outline the structure first, then fill in details systematically',
        scores: {
          sequential: 15,
          clarityFirst: 12,
          analytical: 8
        }
      },
      {
        id: 'q9c2',
        text: 'Start creating slides spontaneously, let ideas flow naturally',
        scores: {
          improviser: 15,
          intuitionDriven: 12,
          fastDecider: 8
        }
      },
      {
        id: 'q9c3',
        text: 'Look at successful pitch decks, identify patterns, adapt best practices',
        scores: {
          patternSeeker: 15,
          analytical: 10,
          sequential: 6
        }
      },
      {
        id: 'q9c4',
        text: 'Use a proven template to minimize risk',
        scores: {
          comfortSeeker: 12,
          sequential: 10,
          clarityFirst: 6
        }
      }
    ]
  },
  {
    id: 'q10',
    title: 'Daily Planning',
    scenario: 'How do you typically structure your workday?',
    choices: [
      {
        id: 'q10c1',
        text: 'Detailed schedule with time blocks for each task',
        scores: {
          sequential: 15,
          analytical: 10,
          clarityFirst: 10,
          overthinker: 6
        }
      },
      {
        id: 'q10c2',
        text: 'Flexible list - tackle what feels right in the moment',
        scores: {
          improviser: 15,
          intuitionDriven: 12,
          fastDecider: 8
        }
      },
      {
        id: 'q10c3',
        text: 'No rigid plan - stay open to opportunities and flow state',
        scores: {
          improviser: 12,
          riskNeutral: 10,
          intuitionDriven: 10
        }
      },
      {
        id: 'q10c4',
        text: 'Follow consistent routines - same structure every day',
        scores: {
          comfortSeeker: 12,
          sequential: 12,
          clarityFirst: 6
        }
      }
    ]
  },
  {
    id: 'q11',
    title: 'Feedback Reception',
    scenario: 'You receive critical feedback on your work. What\'s your immediate reaction?',
    choices: [
      {
        id: 'q11c1',
        text: 'Analyze it objectively, separate emotion from facts, identify actionable improvements',
        scores: {
          analytical: 15,
          clarityFirst: 12,
          overthinker: 8
        }
      },
      {
        id: 'q11c2',
        text: 'Trust your instinct on whether it\'s valid, act quickly on what resonates',
        scores: {
          intuitionDriven: 15,
          fastDecider: 12,
          riskNeutral: 6
        }
      },
      {
        id: 'q11c3',
        text: 'Look for patterns - does this align with past feedback?',
        scores: {
          patternSeeker: 15,
          analytical: 10,
          overthinker: 8
        }
      },
      {
        id: 'q11c4',
        text: 'Feel defensive initially, need time to process before accepting it',
        scores: {
          comfortSeeker: 12,
          overthinker: 12,
          improviser: -5
        }
      }
    ]
  },
  {
    id: 'q12',
    title: 'Innovation Approach',
    scenario: 'Your company asks for innovative ideas to improve a product. How do you brainstorm?',
    choices: [
      {
        id: 'q12c1',
        text: 'Research competitors, analyze market gaps, build data-driven proposals',
        scores: {
          analytical: 15,
          sequential: 10,
          clarityFirst: 10,
          patternSeeker: 8
        }
      },
      {
        id: 'q12c2',
        text: 'Free-associate wild ideas first, refine later',
        scores: {
          improviser: 15,
          intuitionDriven: 12,
          riskNeutral: 10
        }
      },
      {
        id: 'q12c3',
        text: 'Look at innovations in other industries, find transferable patterns',
        scores: {
          patternSeeker: 15,
          analytical: 10,
          intuitionDriven: 8,
          riskNeutral: 6
        }
      },
      {
        id: 'q12c4',
        text: 'Incremental improvements to existing features - less risky',
        scores: {
          comfortSeeker: 12,
          analytical: 8,
          sequential: 8,
          overthinker: 6
        }
      }
    ]
  }
];

export const getQuestions = (): Question[] => {
  return questions;
};
