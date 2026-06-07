import type { DayConfig, Difficulty } from '../types/game';

export const dayConfigs: Record<Difficulty, DayConfig> = {
  easy: {
    difficulty: 'easy',
    dayName: '新手日',
    duration: 120,
    customerSpawnRate: 8000,
    eventFrequency: 0.05,
    targetSatisfaction: 60,
    targetRevenue: 200,
    catDecayRate: 1,
    description: '轻松愉快的第一天，顾客不多，慢慢来~',
    holidayChance: 0.1,
  },
  normal: {
    difficulty: 'normal',
    dayName: '忙碌日',
    duration: 150,
    customerSpawnRate: 5000,
    eventFrequency: 0.1,
    targetSatisfaction: 70,
    targetRevenue: 400,
    catDecayRate: 1.3,
    description: '顾客开始多起来了，要加快速度哦!',
    holidayChance: 0.2,
  },
  hard: {
    difficulty: 'hard',
    dayName: '挑战日',
    duration: 180,
    customerSpawnRate: 3000,
    eventFrequency: 0.18,
    targetSatisfaction: 80,
    targetRevenue: 700,
    catDecayRate: 1.6,
    description: '超级忙碌的一天!顾客排队、突发事件不断，能撑住吗?',
    holidayChance: 0.35,
  },
};

export const difficultyList: Difficulty[] = ['easy', 'normal', 'hard'];

export const difficultyLabels: Record<Difficulty, string> = {
  easy: '🌱 新手日',
  normal: '🔥 忙碌日',
  hard: '⚡ 挑战日',
};

export const difficultyColors: Record<Difficulty, string> = {
  easy: 'from-matcha-100 to-matcha-200',
  normal: 'from-warm-200 to-warm-300',
  hard: 'from-rose-400 to-rose-500',
};
