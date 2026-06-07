import { create } from 'zustand';
import type {
  GameState,
  Difficulty,
  Cat,
  Customer,
  DrinkType,
  Temperature,
  CatAction,
  EventType,
  Notification,
} from '../game/types/game';
import { initialCats } from '../game/config/catData';
import { dayConfigs } from '../game/config/dayConfigs';
import { clamp, uid, generateCustomer, randomChoice } from '../utils/helpers';
import type { GameResult } from '../game/types/game';
import { saveHighScore, loadHighScores } from '../utils/storage';
import { calculateStars, calculateScore } from '../utils/helpers';

interface GameActions {
  startGame: (difficulty: Difficulty) => void;
  endGame: () => GameResult;
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
  removeCustomer: (customerId: string, satisfied: boolean) => void;
  
  getSelectedCustomer: () => Customer | undefined;
}

const initialEnvironment = {
  litterCleanliness: 100,
  foodSupply: 100,
  machineBroken: false,
  machineRepairTime: 0,
};

const createInitialState = (difficulty: Difficulty): Omit<GameState, 'scene'> => {
  const config = dayConfigs[difficulty];
  const isHoliday = Math.random() < config.holidayChance;
  
  return {
    day: difficulty === 'easy' ? 1 : difficulty === 'normal' ? 2 : 3,
    difficulty,
    satisfaction: 75,
    revenue: 0,
    timeRemaining: config.duration,
    customersServed: 0,
    correctDrinks: 0,
    totalDrinks: 0,
    cats: initialCats.map(cat => ({ ...cat })),
    customers: [],
    environment: { ...initialEnvironment },
    isPaused: false,
    isHoliday,
    currentEvent: null,
    eventMessage: '',
    eventTimer: 0,
    selectedDrinkType: null,
    selectedTemperature: null,
    selectedCustomerId: null,
    notifications: [],
  };
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...createInitialState('easy'),

  startGame: (difficulty) => {
    set(createInitialState(difficulty));
    if (get().isHoliday) {
      get().addNotification('🎉 节假日客流高峰!收入增加，但顾客更多了!', 'info');
    }
  },

  endGame: (): GameResult => {
    const state = get();
    const config = dayConfigs[state.difficulty];
    const success = state.satisfaction >= config.targetSatisfaction && state.revenue >= config.targetRevenue;
    const stars = calculateStars(state.satisfaction, state.revenue, config.targetSatisfaction, config.targetRevenue);
    const score = calculateScore(state.satisfaction, state.revenue, state.customersServed);
    
    const isNewHighScore = saveHighScore({
      difficulty: state.difficulty,
      score,
      revenue: state.revenue,
      satisfaction: state.satisfaction,
      date: new Date().toLocaleDateString('zh-CN'),
      customersServed: state.customersServed,
    });

    return {
      success,
      satisfaction: state.satisfaction,
      revenue: state.revenue,
      customersServed: state.customersServed,
      correctDrinks: state.correctDrinks,
      totalDrinks: state.totalDrinks,
      stars,
      isNewHighScore,
    };
  },

  tick: (delta) => {
    const state = get();
    if (state.isPaused || state.timeRemaining <= 0) return;

    const config = dayConfigs[state.difficulty];
    const decayRate = config.catDecayRate;
    const dt = delta / 1000;

    set((s) => ({
      timeRemaining: Math.max(0, s.timeRemaining - dt),
    }));

    set((s) => ({
      cats: s.cats.map((cat) => {
        let newMood = clamp(cat.mood - decayRate * dt * 0.8, 0, 100);
        let newHunger = clamp(cat.hunger - decayRate * dt * 1.2, 0, 100);
        let newHealth = cat.health;
        let newIsSick = cat.isSick;

        if (newHunger < 20) {
          newMood = clamp(newMood - dt * 2, 0, 100);
          newHealth = clamp(newHealth - dt * 0.5, 0, 100);
        }
        if (s.environment.litterCleanliness < 30) {
          newMood = clamp(newMood - dt * 1, 0, 100);
        }
        if (newIsSick) {
          newHealth = clamp(newHealth - dt * 1.5, 0, 100);
          newMood = clamp(newMood - dt * 1, 0, 100);
        }

        return {
          ...cat,
          mood: newMood,
          hunger: newHunger,
          health: newHealth,
          isSick: newIsSick,
        };
      }),
    }));

    set((s) => ({
      environment: {
        ...s.environment,
        litterCleanliness: clamp(s.environment.litterCleanliness - decayRate * dt * 0.6, 0, 100),
        foodSupply: clamp(s.environment.foodSupply - decayRate * dt * 0.4, 0, 100),
        machineRepairTime: Math.max(0, s.environment.machineRepairTime - dt),
        machineBroken: s.environment.machineRepairTime > 0 ? s.environment.machineBroken : false,
      },
    }));

    set((s) => {
      const updatedCustomers: Customer[] = [];
      let lostCustomers = 0;

      for (const customer of s.customers) {
        const newPatience = customer.patience - dt;
        if (newPatience <= 0) {
          lostCustomers++;
        } else {
          updatedCustomers.push({ ...customer, patience: newPatience });
        }
      }

      return {
        customers: updatedCustomers,
        satisfaction: clamp(s.satisfaction - lostCustomers * 8, 0, 100),
      };
    });

    set((s) => {
      let satChange = 0;
      const avgCatMood = s.cats.reduce((sum, c) => sum + c.mood, 0) / s.cats.length;
      if (avgCatMood < 30) satChange -= dt * 0.3;
      if (avgCatMood > 70) satChange += dt * 0.1;
      if (s.environment.litterCleanliness < 30) satChange -= dt * 0.4;
      if (s.environment.foodSupply < 20) satChange -= dt * 0.2;
      if (s.environment.machineBroken) satChange -= dt * 0.3;

      return {
        satisfaction: clamp(s.satisfaction + satChange, 0, 100),
      };
    });

    if (state.eventTimer > 0) {
      set((s) => ({ eventTimer: Math.max(0, s.eventTimer - dt) }));
      if (get().eventTimer <= 0) {
        get().clearEvent();
      }
    }

    const expiredNotifs = state.notifications.filter((n) => Date.now() - n.timestamp > 3000);
    if (expiredNotifs.length > 0) {
      set((s) => ({
        notifications: s.notifications.filter((n) => Date.now() - n.timestamp <= 3000),
      }));
    }
  },

  togglePause: () => set((s) => ({ isPaused: !s.isPaused })),

  interactWithCat: (catId, action) => {
    const state = get();
    const cat = state.cats.find((c) => c.id === catId);
    if (!cat) return;

    let moodGain = 0;
    let hungerGain = 0;
    let healthGain = 0;
    let cureSick = false;

    switch (action) {
      case 'pet':
        moodGain = 15;
        if (cat.personality === 'shy') moodGain = 8;
        if (cat.personality === 'friendly') moodGain = 20;
        break;
      case 'feed':
        if (state.environment.foodSupply < 10) {
          state.addNotification('猫粮不够了，先补充猫粮!', 'warning');
          return;
        }
        hungerGain = 30;
        moodGain = 5;
        set((s) => ({
          environment: { ...s.environment, foodSupply: clamp(s.environment.foodSupply - 8, 0, 100) },
        }));
        break;
      case 'play':
        moodGain = 20;
        hungerGain = -5;
        if (cat.personality === 'lazy') moodGain = 10;
        if (cat.personality === 'playful') moodGain = 28;
        break;
      case 'heal':
        if (cat.isSick || cat.health < 80) {
          healthGain = 35;
          cureSick = true;
          moodGain = 10;
        } else {
          state.addNotification(`${cat.name}很健康，不需要治疗~`, 'info');
          return;
        }
        break;
    }

    set((s) => ({
      cats: s.cats.map((c) =>
        c.id === catId
          ? {
              ...c,
              mood: clamp(c.mood + moodGain, 0, 100),
              hunger: clamp(c.hunger + hungerGain, 0, 100),
              health: clamp(c.health + healthGain, 0, 100),
              isSick: cureSick ? false : c.isSick,
            }
          : c
      ),
    }));

    const messages: Record<CatAction, string> = {
      pet: `你摸了摸${cat.name}，它很开心!`,
      feed: `${cat.name}吃饱了，喵~`,
      play: `和${cat.name}玩了一会儿，它很兴奋!`,
      heal: `${cat.name}接受了治疗，感觉好多了!`,
    };
    state.addNotification(messages[action], 'success');
  },

  selectDrinkType: (type) => set({ selectedDrinkType: type }),
  selectTemperature: (temp) => set({ selectedTemperature: temp }),
  selectCustomer: (customerId) => set({ selectedCustomerId: customerId }),

  serveDrink: () => {
    const state = get();
    if (state.environment.machineBroken) {
      state.addNotification('咖啡机坏了!先修理一下吧~', 'error');
      return { success: false, message: '咖啡机故障' };
    }
    if (!state.selectedDrinkType || !state.selectedTemperature) {
      state.addNotification('请先选择饮品和温度!', 'warning');
      return { success: false, message: '未选择饮品或温度' };
    }
    if (!state.selectedCustomerId) {
      state.addNotification('请先选择一位顾客!', 'warning');
      return { success: false, message: '未选择顾客' };
    }

    const customer = state.customers.find((c) => c.id === state.selectedCustomerId);
    if (!customer) {
      state.addNotification('顾客已离开!', 'error');
      return { success: false, message: '顾客不存在' };
    }

    const isCorrectDrink = state.selectedDrinkType === customer.order.drinkType;
    const isCorrectTemp = state.selectedTemperature === customer.order.temperature;
    const isCorrect = isCorrectDrink && isCorrectTemp;

    set((s) => ({ totalDrinks: s.totalDrinks + 1 }));

    if (isCorrect) {
      let reward = customer.order.reward + customer.tip;
      
      if (customer.wantsPhoto) {
        const happyCats = state.cats.filter((c) => c.mood >= 70 && !c.isSick);
        if (happyCats.length > 0) {
          const photoCat = randomChoice(happyCats);
          const photoBonus = Math.round(reward * 0.5);
          reward += photoBonus;
          state.addNotification(`📸 和${photoCat.name}合影!额外收入+¥${photoBonus}`, 'success');
        }
      }

      if (state.isHoliday) {
        reward = Math.round(reward * 1.3);
      }

      set((s) => ({
        revenue: s.revenue + reward,
        customersServed: s.customersServed + 1,
        correctDrinks: s.correctDrinks + 1,
        satisfaction: clamp(s.satisfaction + 4, 0, 100),
      }));

      get().removeCustomer(customer.id, true);
      state.addNotification(`✅ 完美! +¥${reward}`, 'success');
      
      set({
        selectedDrinkType: null,
        selectedTemperature: null,
        selectedCustomerId: null,
      });

      return { success: true, message: `获得 ¥${reward}` };
    } else {
      set((s) => ({
        satisfaction: clamp(s.satisfaction - 6, 0, 100),
      }));
      get().removeCustomer(customer.id, false);
      state.addNotification(`❌ 做错了!顾客不满意离开了...`, 'error');
      
      set({
        selectedDrinkType: null,
        selectedTemperature: null,
        selectedCustomerId: null,
      });

      return { success: false, message: '饮品错误' };
    }
  },

  cleanLitter: () => {
    set((s) => ({
      environment: { ...s.environment, litterCleanliness: 100 },
      satisfaction: clamp(s.satisfaction + 2, 0, 100),
    }));
    get().addNotification('🧹 猫砂盆已清理干净!', 'success');
  },

  refillFood: () => {
    set((s) => ({
      environment: { ...s.environment, foodSupply: 100 },
    }));
    get().addNotification('🍽️ 猫粮已补充!', 'success');
  },

  repairMachine: () => {
    set((s) => ({
      environment: {
        ...s.environment,
        machineBroken: false,
        machineRepairTime: 0,
      },
    }));
    get().addNotification('🔧 咖啡机已修好!', 'success');
  },

  triggerEvent: (type, message) => {
    set({
      currentEvent: type,
      eventMessage: message,
      eventTimer: 5,
    });

    if (type === 'catSick') {
      const sickCat = randomChoice(get().cats);
      set((s) => ({
        cats: s.cats.map((c) => (c.id === sickCat.id ? { ...c, isSick: true, health: clamp(c.health - 20, 0, 100) } : c)),
      }));
    } else if (type === 'customerComplaint') {
      set((s) => ({ satisfaction: clamp(s.satisfaction - 10, 0, 100) }));
    } else if (type === 'machineBreak') {
      set((s) => ({
        environment: { ...s.environment, machineBroken: true, machineRepairTime: 15 },
      }));
    } else if (type === 'holiday') {
      set({ isHoliday: true });
    }

    get().addNotification(message, type === 'holiday' ? 'info' : 'warning');
  },

  clearEvent: () => set({ currentEvent: null, eventMessage: '', eventTimer: 0 }),

  addNotification: (message, type) => {
    const notif: Notification = {
      id: uid('notif'),
      message,
      type,
      timestamp: Date.now(),
    };
    set((s) => ({
      notifications: [...s.notifications.slice(-4), notif],
    }));
  },

  removeNotification: (id) => {
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    }));
  },

  spawnCustomer: () => {
    const state = get();
    if (state.customers.length >= 6) return;
    if (state.timeRemaining <= 0) return;

    const config = dayConfigs[state.difficulty];
    const patienceMult = state.difficulty === 'easy' ? 1.3 : state.difficulty === 'normal' ? 1 : 0.8;
    const holidayBonus = state.isHoliday ? 0.2 : 0;
    const customer = generateCustomer(patienceMult, holidayBonus);
    
    set((s) => ({
      customers: [...s.customers, customer],
    }));
  },

  removeCustomer: (customerId, satisfied) => {
    set((s) => ({
      customers: s.customers.filter((c) => c.id !== customerId),
      selectedCustomerId: s.selectedCustomerId === customerId ? null : s.selectedCustomerId,
    }));
  },

  getSelectedCustomer: () => {
    const state = get();
    return state.customers.find((c) => c.id === state.selectedCustomerId);
  },
}));

export { loadHighScores };
