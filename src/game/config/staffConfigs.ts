import type { StaffConfig } from '../types/game';

export const staffConfigs: StaffConfig[] = [
  {
    strategy: 'cleanFirst',
    name: '清洁专员',
    emoji: '🧹',
    description: '优先维护环境卫生，保持猫砂和店铺清洁。',
    efficiency: 0.85,
    errorRate: 0.05,
    dailyCost: 80,
    autoActions: {
      clean: 0.6,
      makeDrink: 0.1,
      feedCat: 0.15,
      healCat: 0.05,
      petCat: 0.1,
    },
  },
  {
    strategy: 'drinkFirst',
    name: '饮品大师',
    emoji: '☕',
    description: '专注于快速制作饮品，提高出杯效率。',
    efficiency: 0.9,
    errorRate: 0.03,
    dailyCost: 120,
    autoActions: {
      clean: 0.1,
      makeDrink: 0.6,
      feedCat: 0.1,
      healCat: 0.05,
      petCat: 0.15,
    },
  },
  {
    strategy: 'catCareFirst',
    name: '猫咪照护师',
    emoji: '🐾',
    description: '把猫咪放在第一位，喂食、抚摸、治疗都很擅长。',
    efficiency: 0.8,
    errorRate: 0.04,
    dailyCost: 100,
    autoActions: {
      clean: 0.15,
      makeDrink: 0.05,
      feedCat: 0.3,
      healCat: 0.2,
      petCat: 0.3,
    },
  },
  {
    strategy: 'balanced',
    name: '全能店员',
    emoji: '🧑‍💼',
    description: '各项工作均衡分配，适合应对复杂情况。',
    efficiency: 0.75,
    errorRate: 0.06,
    dailyCost: 90,
    autoActions: {
      clean: 0.25,
      makeDrink: 0.25,
      feedCat: 0.2,
      healCat: 0.1,
      petCat: 0.2,
    },
  },
];

export const staffStrategyLabels: Record<StaffConfig['strategy'], string> = {
  cleanFirst: '清洁优先',
  drinkFirst: '饮品优先',
  catCareFirst: '猫咪照护优先',
  balanced: '均衡分配',
};
