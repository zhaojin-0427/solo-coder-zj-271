export type DrinkType = 'coffee' | 'matcha' | 'milkTea' | 'cappuccino';
export type Temperature = 'hot' | 'ice' | 'warm';
export type Difficulty = 'easy' | 'normal' | 'hard';
export type SceneKey = 'Menu' | 'Game' | 'Result' | 'Learn';
export type CatAction = 'feed' | 'pet' | 'play' | 'heal';
export type EventType = 'catSick' | 'customerComplaint' | 'machineBreak' | 'holiday' | null;

export interface Cat {
  id: string;
  name: string;
  emoji: string;
  mood: number;
  hunger: number;
  health: number;
  isSick: boolean;
  personality: 'lazy' | 'playful' | 'shy' | 'friendly';
}

export interface Order {
  drinkType: DrinkType;
  temperature: Temperature;
  reward: number;
}

export interface Customer {
  id: string;
  name: string;
  emoji: string;
  patience: number;
  maxPatience: number;
  order: Order;
  wantsPhoto: boolean;
  photoCatId?: string;
  tip: number;
}

export interface Environment {
  litterCleanliness: number;
  foodSupply: number;
  machineBroken: boolean;
  machineRepairTime: number;
}

export interface DayConfig {
  difficulty: Difficulty;
  dayName: string;
  duration: number;
  customerSpawnRate: number;
  eventFrequency: number;
  targetSatisfaction: number;
  targetRevenue: number;
  catDecayRate: number;
  description: string;
  holidayChance: number;
}

export interface GameState {
  day: number;
  difficulty: Difficulty;
  satisfaction: number;
  revenue: number;
  timeRemaining: number;
  customersServed: number;
  correctDrinks: number;
  totalDrinks: number;
  cats: Cat[];
  customers: Customer[];
  environment: Environment;
  isPaused: boolean;
  isHoliday: boolean;
  currentEvent: EventType;
  eventMessage: string;
  eventTimer: number;
  selectedDrinkType: DrinkType | null;
  selectedTemperature: Temperature | null;
  selectedCustomerId: string | null;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

export interface HighScore {
  difficulty: Difficulty;
  score: number;
  revenue: number;
  satisfaction: number;
  date: string;
  customersServed: number;
}

export interface CatKnowledge {
  id: string;
  category: 'diet' | 'health' | 'behavior' | 'environment';
  categoryName: string;
  title: string;
  content: string;
  emoji: string;
}

export interface DrinkRecipe {
  type: DrinkType;
  name: string;
  emoji: string;
  basePrice: number;
  description: string;
}

export interface TemperatureOption {
  type: Temperature;
  name: string;
  emoji: string;
}

export interface GameResult {
  success: boolean;
  satisfaction: number;
  revenue: number;
  customersServed: number;
  correctDrinks: number;
  totalDrinks: number;
  stars: number;
  isNewHighScore: boolean;
}
