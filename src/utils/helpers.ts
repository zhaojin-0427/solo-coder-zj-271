import type { DrinkType, Temperature, Customer, Cat } from '../game/types/game';
import { drinkRecipes, temperatureOptions } from '../game/config/drinkRecipes';
import { catNames, catEmojis } from '../game/config/catData';

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function generateOrder(): { drinkType: DrinkType; temperature: Temperature; reward: number } {
  const recipe = randomChoice(drinkRecipes);
  const temp = randomChoice(temperatureOptions);
  const tipMultiplier = randomFloat(0.8, 1.3);
  return {
    drinkType: recipe.type,
    temperature: temp.type,
    reward: Math.round(recipe.basePrice * tipMultiplier),
  };
}

const customerEmojis = ['👩', '👨', '👧', '👦', '🧑', '👵', '👴', '🧔', '👩‍🦰', '👨‍🦱', '👩‍🎓', '👨‍💼'];

export function generateCustomer(patienceMultiplier = 1, holidayBonus = 0): Customer {
  const order = generateOrder();
  const basePatience = randomInt(25, 45);
  const wantsPhoto = Math.random() < 0.35;
  const tip = Math.round(order.reward * randomFloat(0.1, 0.3));
  
  return {
    id: uid('customer'),
    name: randomChoice(catNames),
    emoji: randomChoice(customerEmojis),
    patience: basePatience * patienceMultiplier,
    maxPatience: basePatience * patienceMultiplier,
    order: {
      ...order,
      reward: Math.round(order.reward * (1 + holidayBonus)),
    },
    wantsPhoto,
    tip,
  };
}

export function getMoodColor(mood: number): string {
  if (mood >= 70) return 'bg-matcha-200';
  if (mood >= 40) return 'bg-warm-200';
  return 'bg-rose-400';
}

export function getMoodTextColor(mood: number): string {
  if (mood >= 70) return 'text-matcha-300';
  if (mood >= 40) return 'text-warm-300';
  return 'text-rose-500';
}

export function getCatOverallStatus(cat: Cat): 'good' | 'okay' | 'bad' {
  const avg = (cat.mood + cat.hunger + cat.health) / 3;
  if (avg >= 70) return 'good';
  if (avg >= 40) return 'okay';
  return 'bad';
}

export function calculateStars(
  satisfaction: number,
  revenue: number,
  targetSatisfaction: number,
  targetRevenue: number
): number {
  const satFactor = satisfaction / targetSatisfaction;
  const revFactor = revenue / targetRevenue;
  const overall = (satFactor + revFactor) / 2;
  
  if (overall >= 1.3) return 3;
  if (overall >= 1.0) return 2;
  if (overall >= 0.7) return 1;
  return 0;
}

export function calculateScore(satisfaction: number, revenue: number, customersServed: number): number {
  return Math.round(satisfaction * 10 + revenue + customersServed * 5);
}
