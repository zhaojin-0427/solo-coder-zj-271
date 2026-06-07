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
  leaveReason?: 'timeout' | 'wrongDrink' | 'satisfied';
}

export interface Environment {
  litterCleanliness: number;
  foodSupply: number;
  machineDurability?: number;
  machineBroken: boolean;
  machineRepairTime: number;
  hygiene?: number;
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
  scene?: SceneKey;
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

export type BusinessEvent =
  | 'festival'
  | 'rainstorm'
  | 'influencer'
  | 'catStress'
  | 'ingredientShortage'
  | 'none';

export interface BusinessEventConfig {
  id: BusinessEvent;
  name: string;
  emoji: string;
  description: string;
  customerSpawnMultiplier: number;
  orderValueMultiplier: number;
  photoDemandMultiplier: number;
  scoreWeightMultiplier: number;
  catMoodModifier: number;
  catHealthModifier: number;
  hygieneDecayMultiplier: number;
}

export type StaffStrategy = 'cleanFirst' | 'drinkFirst' | 'catCareFirst' | 'balanced';

export interface Staff {
  id: string;
  name: string;
  emoji: string;
  strategy: StaffStrategy;
  efficiency: number;
  errorRate: number;
  dailyCost: number;
}

export interface StaffConfig {
  strategy: StaffStrategy;
  name: string;
  emoji: string;
  description: string;
  efficiency: number;
  errorRate: number;
  dailyCost: number;
  autoActions: {
    clean: number;
    makeDrink: number;
    feedCat: number;
    healCat: number;
    petCat: number;
  };
}

export type PrepCategory = 'catFood' | 'cleaning' | 'equipment' | 'catTreatment';

export interface PrepPurchase {
  category: PrepCategory;
  id: string;
  name: string;
  emoji: string;
  description: string;
  cost: number;
  effect: {
    foodSupply?: number;
    hygiene?: number;
    litterCleanliness?: number;
    machineDurability?: number;
    catHealth?: number;
    catMood?: number;
    catCureAll?: boolean;
  };
}

export interface DailyStats {
  day: number;
  revenue: number;
  satisfactionStart: number;
  satisfactionEnd: number;
  customersServed: number;
  customersLost: number;
  lostReasons: { timeout: number; wrongDrink: number };
  correctDrinks: number;
  totalDrinks: number;
  event: BusinessEvent;
  complaints: number;
  catAvgMood: number;
  catAvgHealth: number;
  catAvgHunger: number;
  catsSickEndOfDay: number;
  hygiene: number;
  staffCost: number;
  prepCost: number;
  netProfit: number;
  keyEvents: string[];
}

export interface WeekState {
  id: string;
  createdAt: string;
  currentDay: number;
  totalDays: number;
  difficulty: Difficulty;
  startingBudget: number;
  budget: number;
  cumulativeRevenue: number;
  cumulativeProfit: number;
  avgSatisfaction: number;
  cats: Cat[];
  unlockedDrinks: DrinkType[];
  totalComplaints: number;
  history: DailyStats[];
  bestDay: number | null;
  worstDay: number | null;
  isComplete: boolean;
  finalScore: number | null;
  name: string;
  environment?: Environment;
}

export type WeekScene = 'menu' | 'prep' | 'business' | 'settlement' | 'review';

export interface WeeklyArchive {
  id: string;
  name: string;
  createdAt: string;
  difficulty: Difficulty;
  totalRevenue: number;
  totalProfit: number;
  avgSatisfaction: number;
  bestDayRevenue: number;
  daysCompleted: number;
  finalScore: number;
  history: DailyStats[];
  budget: number;
  cats: Cat[];
  unlockedDrinks: DrinkType[];
  totalComplaints: number;
  currentEnvironment: Environment;
}

export interface BestWeekRecord {
  id: string;
  name: string;
  createdAt: string;
  difficulty: Difficulty;
  totalRevenue: number;
  avgSatisfaction: number;
  finalScore: number;
  history: DailyStats[];
}

export interface DailyState {
  day: number;
  difficulty: Difficulty;
  satisfaction: number;
  revenue: number;
  timeRemaining: number;
  customersServed: number;
  correctDrinks: number;
  totalDrinks: number;
  complaintsToday: number;
  customersLost: number;
  lostReasons: { timeout: number; wrongDrink: number };
  cats: Cat[];
  customers: Customer[];
  environment: Environment;
  unlockedDrinks: DrinkType[];
  isPaused: boolean;
  businessEvent: BusinessEvent;
  currentEvent: EventType;
  eventMessage: string;
  eventTimer: number;
  selectedDrinkType: DrinkType | null;
  selectedTemperature: Temperature | null;
  selectedCustomerId: string | null;
  notifications: Notification[];
  staff: Staff[];
}

export interface DailyActions {
  startDay: (day: number, weekState: WeekState, event: BusinessEvent, staff: Staff[]) => void;
  endDay: () => DailyStats;
  tick: (delta: number) => void;
  togglePause: () => void;
  interactWithCat: (catId: string, action: CatAction) => void;
  selectDrinkType: (type: DrinkType | null) => void;
  selectTemperature: (temp: Temperature | null) => void;
  selectCustomer: (customerId: string | null) => void;
  serveDrink: () => { success: boolean; message: string };
  cleanLitter: () => void;
  refillFood: () => void;
  repairMachine: () => void;
  triggerEvent: (type: EventType, message: string) => void;
  clearEvent: () => void;
  addNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
  spawnCustomer: () => void;
  removeCustomer: (customerId: string, satisfied: boolean, reason?: 'timeout' | 'wrongDrink' | 'satisfied') => void;
  getSelectedCustomer: () => Customer | undefined;
}

export interface TransitionState {
  isActive: boolean;
  currentDay: number;
  nextDay: number;
  budget: number;
  maxBudget: number;
  selectedPurchases: PrepPurchase[];
  availablePurchases: PrepPurchase[];
  staffOptions: StaffConfig[];
  selectedStaff: Staff[];
  previousDayStats: DailyStats | null;
  carriedCats: Cat[];
  carriedEnvironment: Environment;
  carriedUnlockedDrinks: DrinkType[];
  carriedComplaints: number;
  predictedEvent: BusinessEvent | null;
}

export interface TransitionActions {
  enterTransition: (
    weekState: WeekState,
    dayStats: DailyStats,
    cats: Cat[],
    environment: Environment,
    unlockedDrinks: DrinkType[],
    complaints: number
  ) => void;
  addPurchase: (purchase: PrepPurchase) => boolean;
  removePurchase: (purchaseId: string) => void;
  setStaffStrategy: (staffId: string, strategy: StaffStrategy) => void;
  addStaff: (config: StaffConfig) => boolean;
  removeStaff: (staffId: string) => void;
  getBudgetRemaining: () => number;
  applyEffectsAndProceed: () => {
    cats: Cat[];
    environment: Environment;
    unlockedDrinks: DrinkType[];
    complaints: number;
    budget: number;
    staff: Staff[];
    nextEvent: BusinessEvent;
    totalPurchaseCost: number;
    totalStaffCost: number;
  };
  reset: () => void;
}
