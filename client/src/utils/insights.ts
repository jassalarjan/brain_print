import { FinalScores } from '../store/useStore';

export interface Insight {
  category: string;
  title: string;
  description: string;
  icon: string;
}

export function generateInsights(scores: FinalScores): Insight[] {
  const insights: Insight[] = [];

  // Sort traits by score
  const sortedTraits = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([trait]) => trait);

  const topTrait = sortedTraits[0];
  const secondTrait = sortedTraits[1];

  // HOW YOU THINK
  if (scores.analytical > 70 && scores.sequential > 60) {
    insights.push({
      category: 'How You Think',
      title: 'Systematic Problem Solver',
      description:
        'You excel at breaking down complex problems into manageable steps. Your analytical approach combined with sequential thinking makes you highly effective at structured tasks and strategic planning.',
      icon: '🧩',
    });
  } else if (scores.intuitionDriven > 70 && scores.patternSeeker > 60) {
    insights.push({
      category: 'How You Think',
      title: 'Intuitive Pattern Recognizer',
      description:
        'You have a natural gift for seeing connections others miss. Your intuition combined with pattern recognition allows you to make creative leaps and innovative solutions.',
      icon: '🎨',
    });
  } else if (scores.analytical > 60 && scores.patternSeeker > 60) {
    insights.push({
      category: 'How You Think',
      title: 'Strategic Synthesizer',
      description:
        'You blend analytical rigor with big-picture thinking. This combination allows you to both understand details and see how they fit into larger patterns and systems.',
      icon: '🎯',
    });
  } else {
    insights.push({
      category: 'How You Think',
      title: 'Balanced Thinker',
      description:
        'You maintain a healthy balance between different thinking styles. This versatility allows you to adapt your approach based on the situation at hand.',
      icon: '⚖️',
    });
  }

  // DECISION STYLE
  if (scores.fastDecider > 70 && scores.overthinker < 40) {
    insights.push({
      category: 'Decision Style',
      title: 'Decisive Action-Taker',
      description:
        'You make decisions quickly and confidently. Your ability to act without excessive deliberation helps you seize opportunities and maintain momentum in fast-paced environments.',
      icon: '⚡',
    });
  } else if (scores.overthinker > 70 && scores.clarityFirst > 60) {
    insights.push({
      category: 'Decision Style',
      title: 'Thorough Deliberator',
      description:
        'You value careful consideration before making important decisions. While this can take more time, it often leads to well-thought-out choices with fewer regrets.',
      icon: '🤔',
    });
  } else if (scores.intuitionDriven > 70 && scores.fastDecider > 60) {
    insights.push({
      category: 'Decision Style',
      title: 'Gut-Driven Decider',
      description:
        'You trust your instincts and can make rapid decisions based on intuition. This serves you well in situations requiring quick judgment calls and creative thinking.',
      icon: '💫',
    });
  } else {
    insights.push({
      category: 'Decision Style',
      title: 'Adaptive Decision Maker',
      description:
        'Your decision-making style flexes based on the situation. You know when to decide quickly and when to take your time for thorough analysis.',
      icon: '🎲',
    });
  }

  // LEARNING STYLE
  if (scores.sequential > 70) {
    insights.push({
      category: 'Learning Style',
      title: 'Structured Learner',
      description:
        'You thrive with step-by-step instruction and organized curricula. Breaking skills into sequential milestones helps you master complex subjects effectively.',
      icon: '📚',
    });
  } else if (scores.improviser > 70 && scores.intuitionDriven > 60) {
    insights.push({
      category: 'Learning Style',
      title: 'Experiential Explorer',
      description:
        'You learn best by jumping in and experimenting. Hands-on experience and learning from mistakes is more valuable to you than theoretical study.',
      icon: '🚀',
    });
  } else if (scores.patternSeeker > 70) {
    insights.push({
      category: 'Learning Style',
      title: 'Conceptual Connector',
      description:
        'You excel at understanding new concepts by relating them to what you already know. Building mental models and seeing underlying principles accelerates your learning.',
      icon: '🧠',
    });
  } else {
    insights.push({
      category: 'Learning Style',
      title: 'Multi-Modal Learner',
      description:
        'You combine multiple learning approaches depending on the material. This flexibility allows you to adapt to different teaching styles and subject matter.',
      icon: '🎓',
    });
  }

  // TEAM BEHAVIOR
  if (scores.analytical > 70 && scores.clarityFirst > 60) {
    insights.push({
      category: 'Team Behavior',
      title: 'The Strategist',
      description:
        'You bring clarity and structure to team efforts. Others value your ability to analyze situations objectively and create clear paths forward.',
      icon: '🎯',
    });
  } else if (scores.improviser > 70 && scores.riskNeutral > 60) {
    insights.push({
      category: 'Team Behavior',
      title: 'The Innovator',
      description:
        'You energize teams with creative ideas and willingness to try new approaches. Your comfort with uncertainty helps groups break out of conventional thinking.',
      icon: '💡',
    });
  } else if (scores.patternSeeker > 70 && scores.analytical > 60) {
    insights.push({
      category: 'Team Behavior',
      title: 'The Connector',
      description:
        'You excel at seeing how different team members\' ideas relate and complement each other. Your synthesis skills help bridge perspectives and find integrated solutions.',
      icon: '🔗',
    });
  } else if (scores.comfortSeeker > 60 && scores.sequential > 60) {
    insights.push({
      category: 'Team Behavior',
      title: 'The Stabilizer',
      description:
        'You provide consistency and reliability that teams need. Your preference for proven methods and attention to process helps ensure quality outcomes.',
      icon: '🛡️',
    });
  } else {
    insights.push({
      category: 'Team Behavior',
      title: 'The Collaborator',
      description:
        'You adapt your style to complement team needs. This flexibility makes you a valuable team member in diverse group settings.',
      icon: '🤝',
    });
  }

  // RISK APPROACH - 5th insight
  if (scores.riskNeutral > 70 && scores.comfortSeeker < 40) {
    insights.push({
      category: 'Risk Approach',
      title: 'Calculated Risk-Taker',
      description:
        'You\'re comfortable with uncertainty and see opportunity in change. This trait helps you pursue ambitious goals others might shy away from.',
      icon: '🎢',
    });
  } else if (scores.comfortSeeker > 70) {
    insights.push({
      category: 'Risk Approach',
      title: 'Cautious Optimizer',
      description:
        'You prefer proven approaches and incremental improvements. This helps you build stable, sustainable success without unnecessary risks.',
      icon: '🧭',
    });
  } else {
    insights.push({
      category: 'Risk Approach',
      title: 'Situation-Based Risk Taker',
      description:
        'You assess risk contextually - taking chances when it matters and playing it safe when appropriate. This balanced approach serves you well.',
      icon: '⚡',
    });
  }

  // COMMUNICATION STYLE - 6th insight
  if (scores.clarityFirst > 70) {
    insights.push({
      category: 'Communication Style',
      title: 'Clear Communicator',
      description:
        'You value precision and clarity in communication. Others appreciate your ability to articulate complex ideas in understandable ways.',
      icon: '💬',
    });
  } else if (scores.intuitionDriven > 70 && scores.improviser > 60) {
    insights.push({
      category: 'Communication Style',
      title: 'Dynamic Storyteller',
      description:
        'You communicate through stories, metaphors, and big-picture narratives. Your expressive style helps others connect emotionally with ideas.',
      icon: '🎭',
    });
  } else {
    insights.push({
      category: 'Communication Style',
      title: 'Adaptive Communicator',
      description:
        'You adjust your communication style to your audience. This flexibility helps you connect with diverse personalities and contexts.',
      icon: '📡',
    });
  }

  return insights;
}