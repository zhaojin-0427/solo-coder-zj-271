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

export interface WeekDayConfig extends DayConfig {
  dayNumber: number;
  weekDayName: string;
}

export const weekDayConfigs: WeekDayConfig[] = [
  {
    dayNumber: 1,
    weekDayName: '周一',
    difficulty: 'easy',
    dayName: '开业日',
    duration: 100,
    customerSpawnRate: 9000,
    eventFrequency: 0.03,
    targetSatisfaction: 55,
    targetRevenue: 150,
    catDecayRate: 0.9,
    description: '开店第一天，慢慢适应节奏吧~',
    holidayChance: 0,
  },
  {
    dayNumber: 2,
    weekDayName: '周二',
    difficulty: 'easy',
    dayName: '平日',
    duration: 110,
    customerSpawnRate: 7500,
    eventFrequency: 0.06,
    targetSatisfaction: 60,
    targetRevenue: 250,
    catDecayRate: 1.0,
    description: '普通的工作日，按部就班。',
    holidayChance: 0.1,
  },
  {
    dayNumber: 3,
    weekDayName: '周三',
    difficulty: 'normal',
    dayName: '小高峰',
    duration: 130,
    customerSpawnRate: 6000,
    eventFrequency: 0.1,
    targetSatisfaction: 65,
    targetRevenue: 380,
    catDecayRate: 1.2,
    description: '顾客开始增多，注意节奏!',
    holidayChance: 0.15,
  },
  {
    dayNumber: 4,
    weekDayName: '周四',
    difficulty: 'normal',
    dayName: '忙碌日',
    duration: 150,
    customerSpawnRate: 5000,
    eventFrequency: 0.12,
    targetSatisfaction: 70,
    targetRevenue: 500,
    catDecayRate: 1.35,
    description: '周末前的忙碌日，加油!',
    holidayChance: 0.2,
  },
  {
    dayNumber: 5,
    weekDayName: '周五',
    difficulty: 'hard',
    dayName: '周五狂欢',
    duration: 170,
    customerSpawnRate: 3800,
    eventFrequency: 0.15,
    targetSatisfaction: 72,
    targetRevenue: 650,
    catDecayRate: 1.5,
    description: '周五晚上顾客特别多!',
    holidayChance: 0.3,
  },
  {
    dayNumber: 6,
    weekDayName: '周六',
    difficulty: 'hard',
    dayName: '周末高峰',
    duration: 180,
    customerSpawnRate: 3200,
    eventFrequency: 0.18,
    targetSatisfaction: 75,
    targetRevenue: 800,
    catDecayRate: 1.6,
    description: '周末客流最高峰，挺住!',
    holidayChance: 0.4,
  },
  {
    dayNumber: 7,
    weekDayName: '周日',
    difficulty: 'hard',
    dayName: '收官日',
    duration: 160,
    customerSpawnRate: 4000,
    eventFrequency: 0.14,
    targetSatisfaction: 78,
    targetRevenue: 700,
    catDecayRate: 1.5,
    description: '最后一天，完美收官!',
    holidayChance: 0.35,
  },
];

export const weekStartingBudget: Record<Difficulty, number> = {
  easy: 500,
  normal: 400,
  hard: 300,
};

export const weekDailyBudgetBonus: Record<Difficulty, number> = {
  easy: 0.6,
  normal: 0.4,
  hard: 0.25,
};

export const difficultyList: Difficulty[] = ['easy', 'normal', 'hard'];

export const difficultyLabels: Record<Difficulty, string> = {
  easy: '🌱 新手日',
  normal: '🔥 忙碌日',
  hard: '⚡ 挑战日',
};

export const weekDifficultyLabels: Record<Difficulty, string> = {
  easy: '🌱 悠闲周',
  normal: '🔥 标准周',
  hard: '⚡ 极限周',
};

export const difficultyColors: Record<Difficulty, string> = {
  easy: 'from-matcha-100 to-matcha-200',
  normal: 'from-warm-200 to-warm-300',
  hard: 'from-rose-400 to-rose-500',
};
