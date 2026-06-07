import { create } from 'zustand';
import type {
  DailyState,
  DailyActions,
  Customer,
  DailyStats,
  CatAction,
  Environment,
} from '../game/types/game';
import { weekDayConfigs } from '../game/config/dayConfigs';
import { businessEventConfigs } from '../game/config/businessEvents';
import { staffConfigs } from '../game/config/staffConfigs';
import { clamp, uid, randomChoice, generateCustomer } from '../utils/helpers';
import { initialCats } from '../game/config/catData';

const createInitialEnvironment = (): Environment => ({
  litterCleanliness: 100,
  foodSupply: 100,
  machineDurability: 100,
  machineBroken: false,
  machineRepairTime: 0,
  hygiene: 100,
});

const createInitialDailyState = (): DailyState => {
  const dayConfig = weekDayConfigs[0];
  return {
    day: 1,
    difficulty: dayConfig.difficulty,
    satisfaction: 75,
    revenue: 0,
    timeRemaining: dayConfig.duration,
    customersServed: 0,
    correctDrinks: 0,
    totalDrinks: 0,
    complaintsToday: 0,
    customersLost: 0,
    lostReasons: { timeout: 0, wrongDrink: 0 },
    cats: initialCats.map((c) => ({ ...c })),
    customers: [],
    environment: createInitialEnvironment(),
    unlockedDrinks: ['coffee', 'matcha', 'milkTea', 'cappuccino'],
    isPaused: false,
    businessEvent: 'none',
    currentEvent: null,
    eventMessage: '',
    eventTimer: 0,
    selectedDrinkType: null,
    selectedTemperature: null,
    selectedCustomerId: null,
    notifications: [],
    staff: [],
  };
};

export const useDailyStore = create<DailyState & DailyActions>((set, get) => ({
  ...createInitialDailyState(),

  startDay: (day, weekState, event, staff) => {
    const dayIndex = Math.min(day - 1, weekDayConfigs.length - 1);
    const dayConfig = weekDayConfigs[dayIndex];
    const eventCfg = businessEventConfigs[event];

    set({
      day,
      difficulty: dayConfig.difficulty,
      satisfaction: weekState.history.length > 0
        ? weekState.history[weekState.history.length - 1].satisfactionEnd
        : 75,
      revenue: 0,
      timeRemaining: dayConfig.duration,
      customersServed: 0,
      correctDrinks: 0,
      totalDrinks: 0,
      complaintsToday: 0,
      customersLost: 0,
      lostReasons: { timeout: 0, wrongDrink: 0 },
      cats: weekState.cats.map((c) => ({
        ...c,
        mood: clamp(c.mood + eventCfg.catMoodModifier, 0, 100),
        health: clamp(c.health + eventCfg.catHealthModifier, 0, 100),
      })),
      customers: [],
      environment: { ...createInitialEnvironment() },
      unlockedDrinks: [...weekState.unlockedDrinks],
      isPaused: false,
      businessEvent: event,
      currentEvent: null,
      eventMessage: '',
      eventTimer: 0,
      selectedDrinkType: null,
      selectedTemperature: null,
      selectedCustomerId: null,
      notifications: [],
      staff: staff.map((s) => ({ ...s })),
    });

    if (event !== 'none') {
      get().addNotification(
        `${eventCfg.emoji} ${eventCfg.name}：${eventCfg.description}`,
        eventCfg.catMoodModifier < 0 ? 'warning' : 'info'
      );
    }
  },

  endDay: (): DailyStats => {
    const s = get();
    const avgMood = s.cats.reduce((sum, c) => sum + c.mood, 0) / s.cats.length;
    const avgHealth = s.cats.reduce((sum, c) => sum + c.health, 0) / s.cats.length;
    const avgHunger = s.cats.reduce((sum, c) => sum + c.hunger, 0) / s.cats.length;
    const sickCount = s.cats.filter((c) => c.isSick).length;
    const staffCost = s.staff.reduce((sum, st) => sum + st.dailyCost, 0);
    const eventCfg = businessEventConfigs[s.businessEvent];
    const dayConfig = weekDayConfigs[Math.min(s.day - 1, weekDayConfigs.length - 1)];
    const prevSat = s.day === 1
      ? 75
      : (s.satisfaction - 10);

    const netProfit = s.revenue - staffCost;

    const keyEvents: string[] = [];
    if (s.businessEvent !== 'none') {
      keyEvents.push(`${eventCfg.emoji} ${eventCfg.name}`);
    }
    if (s.complaintsToday > 0) {
      keyEvents.push(`😤 ${s.complaintsToday} 次顾客投诉`);
    }
    if (sickCount > 0) {
      keyEvents.push(`😿 ${sickCount} 只猫咪生病了`);
    }
    if (s.revenue >= dayConfig.targetRevenue * 1.3) {
      keyEvents.push(`💰 营收超出目标30%！`);
    }

    return {
      day: s.day,
      revenue: s.revenue,
      satisfactionStart: clamp(prevSat, 0, 100),
      satisfactionEnd: s.satisfaction,
      customersServed: s.customersServed,
      customersLost: s.customersLost,
      lostReasons: { ...s.lostReasons },
      correctDrinks: s.correctDrinks,
      totalDrinks: s.totalDrinks,
      event: s.businessEvent,
      complaints: s.complaintsToday,
      catAvgMood: Math.round(avgMood),
      catAvgHealth: Math.round(avgHealth),
      catAvgHunger: Math.round(avgHunger),
      catsSickEndOfDay: sickCount,
      hygiene: s.environment.hygiene,
      staffCost,
      prepCost: 0,
      netProfit,
      keyEvents,
    };
  },

  tick: (delta) => {
    const state = get();
    if (state.isPaused || state.timeRemaining <= 0) return;

    const dayIndex = Math.min(state.day - 1, weekDayConfigs.length - 1);
    const dayConfig = weekDayConfigs[dayIndex];
    const eventCfg = businessEventConfigs[state.businessEvent];
    const decayRate = dayConfig.catDecayRate;
    const dt = delta / 1000;

    set((s) => ({
      timeRemaining: Math.max(0, s.timeRemaining - dt),
    }));

    set((s) => ({
      cats: s.cats.map((cat) => {
        let newMood = clamp(cat.mood - decayRate * dt * 0.8, 0, 100);
        const newHunger = clamp(cat.hunger - decayRate * dt * 1.2, 0, 100);
        let newHealth = cat.health;
        let newIsSick = cat.isSick;

        if (newHunger < 20) {
          newMood = clamp(newMood - dt * 2, 0, 100);
          newHealth = clamp(newHealth - dt * 0.5, 0, 100);
        }
        if (s.environment.litterCleanliness < 30) {
          newMood = clamp(newMood - dt * 1, 0, 100);
        }
        if (s.environment.hygiene < 40) {
          newHealth = clamp(newHealth - dt * 0.3, 0, 100);
          if (!newIsSick && Math.random() < 0.0005 * dt * 60) {
            newIsSick = true;
          }
        }
        if (newIsSick) {
          newHealth = clamp(newHealth - dt * 1.5, 0, 100);
          newMood = clamp(newMood - dt * 1, 0, 100);
        }
        if (state.businessEvent === 'catStress') {
          newMood = clamp(newMood - dt * 0.5, 0, 100);
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

    const hygieneMult = eventCfg.hygieneDecayMultiplier;
    set((s) => ({
      environment: {
        ...s.environment,
        litterCleanliness: clamp(s.environment.litterCleanliness - decayRate * dt * 0.6 * hygieneMult, 0, 100),
        foodSupply: clamp(s.environment.foodSupply - decayRate * dt * 0.4, 0, 100),
        hygiene: clamp(s.environment.hygiene - decayRate * dt * 0.3 * hygieneMult, 0, 100),
        machineDurability: clamp(
          s.environment.machineDurability - (state.businessEvent === 'ingredientShortage' ? dt * 0.8 : dt * 0.3),
          0,
          100
        ),
        machineRepairTime: Math.max(0, s.environment.machineRepairTime - dt),
        machineBroken: s.environment.machineRepairTime > 0 ? s.environment.machineBroken : false,
      },
    }));

    set((s) => {
      if (s.environment.machineDurability < 15 && !s.environment.machineBroken && Math.random() < 0.002 * dt * 60) {
        get().triggerEvent('machineBreak', '🔧 咖啡机坏了!快修好吧~');
      }
      return {};
    });

    set((s) => {
      const updatedCustomers: Customer[] = [];
      let lostCustomers = 0;
      let lostTimeout = 0;

      for (const customer of s.customers) {
        const newPatience = customer.patience - dt;
        if (newPatience <= 0) {
          lostCustomers++;
          lostTimeout++;
        } else {
          updatedCustomers.push({ ...customer, patience: newPatience });
        }
      }

      if (lostTimeout > 0) {
        set((ss) => ({
          lostReasons: { ...ss.lostReasons, timeout: ss.lostReasons.timeout + lostTimeout },
        }));
      }

      return {
        customers: updatedCustomers,
        satisfaction: clamp(s.satisfaction - lostCustomers * 8 * eventCfg.scoreWeightMultiplier, 0, 100),
        customersLost: s.customersLost + lostCustomers,
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
      if (s.environment.hygiene < 30) satChange -= dt * 0.2;

      return {
        satisfaction: clamp(s.satisfaction + satChange * eventCfg.scoreWeightMultiplier, 0, 100),
      };
    });

    if (state.staff.length > 0) {
      set((s) => {
        const env = { ...s.environment };
        const cats = s.cats.map((c) => ({ ...c }));

        for (const staff of state.staff) {
          const actionRoll = Math.random();
          let cumulative = 0;

          const staffConfig = staffConfigs.find((c) => c.strategy === staff.strategy);
          const autoActions = staffConfig?.autoActions || { clean: 0, makeDrink: 0, feedCat: 0, healCat: 0, petCat: 0 };

          cumulative += autoActions.clean;
          if (actionRoll < cumulative) {
            env.litterCleanliness = clamp(env.litterCleanliness + 8 * staff.efficiency, 0, 100);
            env.hygiene = clamp(env.hygiene + 5 * staff.efficiency, 0, 100);
            continue;
          }
          cumulative += autoActions.feedCat;
          if (actionRoll < cumulative) {
            if (env.foodSupply > 10) {
              const targetCat = cats.find((c) => c.hunger < 60) || cats[0];
              if (targetCat) {
                targetCat.hunger = clamp(targetCat.hunger + 15 * staff.efficiency, 0, 100);
                targetCat.mood = clamp(targetCat.mood + 3 * staff.efficiency, 0, 100);
                env.foodSupply = clamp(env.foodSupply - 5, 0, 100);
              }
            }
            continue;
          }
          cumulative += autoActions.healCat;
          if (actionRoll < cumulative) {
            const sickCat = cats.find((c) => c.isSick || c.health < 70);
            if (sickCat && Math.random() > staff.errorRate) {
              sickCat.health = clamp(sickCat.health + 10 * staff.efficiency, 0, 100);
              if (sickCat.health > 80) sickCat.isSick = false;
            }
            continue;
          }
          cumulative += autoActions.petCat;
          if (actionRoll < cumulative) {
            const targetCat = cats.find((c) => c.mood < 60) || cats[Math.floor(Math.random() * cats.length)];
            if (targetCat) {
              targetCat.mood = clamp(targetCat.mood + 6 * staff.efficiency, 0, 100);
            }
            continue;
          }
        }

        return { environment: env, cats };
      });
    }

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
    const eventCfg = businessEventConfigs[state.businessEvent];

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
      let reward = Math.round((customer.order.reward + customer.tip) * eventCfg.orderValueMultiplier);

      if (customer.wantsPhoto) {
        const happyCats = state.cats.filter((c) => c.mood >= 70 && !c.isSick);
        if (happyCats.length > 0) {
          const photoCat = randomChoice(happyCats);
          const photoBonus = Math.round(reward * 0.5);
          reward += photoBonus;
          state.addNotification(`📸 和${photoCat.name}合影!额外收入+¥${photoBonus}`, 'success');
        }
      }

      set((s) => ({
        revenue: s.revenue + reward,
        customersServed: s.customersServed + 1,
        correctDrinks: s.correctDrinks + 1,
        satisfaction: clamp(s.satisfaction + 4 * eventCfg.scoreWeightMultiplier, 0, 100),
      }));

      get().removeCustomer(customer.id, true, 'satisfied');
      state.addNotification(`✅ 完美! +¥${reward}`, 'success');

      set({
        selectedDrinkType: null,
        selectedTemperature: null,
        selectedCustomerId: null,
      });

      return { success: true, message: `获得 ¥${reward}` };
    } else {
      set((s) => ({
        satisfaction: clamp(s.satisfaction - 6 * eventCfg.scoreWeightMultiplier, 0, 100),
        complaintsToday: s.complaintsToday + 1,
        lostReasons: { ...s.lostReasons, wrongDrink: s.lostReasons.wrongDrink + 1 },
      }));
      get().removeCustomer(customer.id, false, 'wrongDrink');
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
      environment: { ...s.environment, litterCleanliness: 100, hygiene: clamp(s.environment.hygiene + 15, 0, 100) },
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
        machineDurability: clamp(s.environment.machineDurability + 30, 0, 100),
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
        cats: s.cats.map((c) =>
          c.id === sickCat.id ? { ...c, isSick: true, health: clamp(c.health - 20, 0, 100) } : c
        ),
      }));
    } else if (type === 'customerComplaint') {
      set((s) => ({
        satisfaction: clamp(s.satisfaction - 10, 0, 100),
        complaintsToday: s.complaintsToday + 1,
      }));
    } else if (type === 'machineBreak') {
      set((s) => ({
        environment: { ...s.environment, machineBroken: true, machineRepairTime: 15 },
      }));
    } else if (type === 'holiday') {
      set({ businessEvent: 'festival' });
    }

    get().addNotification(message, type === 'holiday' ? 'info' : 'warning');
  },

  clearEvent: () => set({ currentEvent: null, eventMessage: '', eventTimer: 0 }),

  addNotification: (message, type) => {
    const notif = {
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

    const eventCfg = businessEventConfigs[state.businessEvent];
    const dayIndex = Math.min(state.day - 1, weekDayConfigs.length - 1);
    const dayConfig = weekDayConfigs[dayIndex];
    const patienceMult = dayConfig.difficulty === 'easy' ? 1.3 : dayConfig.difficulty === 'normal' ? 1 : 0.8;
    const holidayBonus = state.businessEvent === 'festival' ? 0.2 : 0;
    const photoBonus = eventCfg.photoDemandMultiplier;

    const customer = generateCustomer(patienceMult, holidayBonus);
    customer.wantsPhoto = Math.random() < 0.35 * photoBonus;

    set((s) => ({
      customers: [...s.customers, customer],
    }));
  },

  removeCustomer: (customerId, satisfied, _reason) => {
    void _reason;
    set((s) => ({
      customers: s.customers.filter((c) => c.id !== customerId),
      selectedCustomerId: s.selectedCustomerId === customerId ? null : s.selectedCustomerId,
      customersLost: satisfied ? s.customersLost : s.customersLost + 1,
    }));
  },

  getSelectedCustomer: () => {
    const state = get();
    return state.customers.find((c) => c.id === state.selectedCustomerId);
  },
}));
