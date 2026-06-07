import type { BusinessEvent, BusinessEventConfig } from '../types/game';

export const businessEventConfigs: Record<BusinessEvent, BusinessEventConfig> = {
  none: {
    id: 'none',
    name: '平静日',
    emoji: '☀️',
    description: '普通的一天，一切正常。',
    customerSpawnMultiplier: 1,
    orderValueMultiplier: 1,
    photoDemandMultiplier: 1,
    scoreWeightMultiplier: 1,
    catMoodModifier: 0,
    catHealthModifier: 0,
    hygieneDecayMultiplier: 1,
  },
  festival: {
    id: 'festival',
    name: '节日主题日',
    emoji: '🎉',
    description: '节日活动！客流暴增，顾客消费更高，也更愿意拍照。',
    customerSpawnMultiplier: 1.5,
    orderValueMultiplier: 1.4,
    photoDemandMultiplier: 2,
    scoreWeightMultiplier: 1.2,
    catMoodModifier: 5,
    catHealthModifier: 0,
    hygieneDecayMultiplier: 1.3,
  },
  rainstorm: {
    id: 'rainstorm',
    name: '暴雨低客流',
    emoji: '🌧️',
    description: '暴雨天气！客流大幅减少，但顾客耐心更高。',
    customerSpawnMultiplier: 0.5,
    orderValueMultiplier: 1.1,
    photoDemandMultiplier: 0.5,
    scoreWeightMultiplier: 0.8,
    catMoodModifier: -5,
    catHealthModifier: 0,
    hygieneDecayMultiplier: 0.7,
  },
  influencer: {
    id: 'influencer',
    name: '网红探店',
    emoji: '📸',
    description: '网红来探店！拍照需求激增，满意度评分权重提高。',
    customerSpawnMultiplier: 1.2,
    orderValueMultiplier: 1.2,
    photoDemandMultiplier: 3,
    scoreWeightMultiplier: 1.5,
    catMoodModifier: 0,
    catHealthModifier: 0,
    hygieneDecayMultiplier: 1.1,
  },
  catStress: {
    id: 'catStress',
    name: '猫咪集体应激',
    emoji: '😿',
    description: '猫咪们集体应激！心情和健康下降加速，需要额外关注。',
    customerSpawnMultiplier: 0.9,
    orderValueMultiplier: 0.9,
    photoDemandMultiplier: 0.3,
    scoreWeightMultiplier: 1.3,
    catMoodModifier: -20,
    catHealthModifier: -10,
    hygieneDecayMultiplier: 1.2,
  },
  ingredientShortage: {
    id: 'ingredientShortage',
    name: '原料短缺',
    emoji: '📦',
    description: '原料短缺！订单价值降低，咖啡机更易故障。',
    customerSpawnMultiplier: 0.8,
    orderValueMultiplier: 0.7,
    photoDemandMultiplier: 1,
    scoreWeightMultiplier: 1.2,
    catMoodModifier: 0,
    catHealthModifier: 0,
    hygieneDecayMultiplier: 1,
  },
};

export function pickRandomBusinessEvent(day: number): BusinessEvent {
  if (day === 1) return 'none';
  const roll = Math.random();
  if (roll < 0.35) return 'none';
  if (roll < 0.5) return 'festival';
  if (roll < 0.65) return 'rainstorm';
  if (roll < 0.8) return 'influencer';
  if (roll < 0.92) return 'catStress';
  return 'ingredientShortage';
}
