import { create } from 'zustand';
import type {
  TransitionState,
  TransitionActions,
  Staff,
  BusinessEvent,
} from '../game/types/game';
import { prepItems } from '../game/config/prepItems';
import { staffConfigs } from '../game/config/staffConfigs';
import { pickRandomBusinessEvent } from '../game/config/businessEvents';
import { weekDailyBudgetBonus } from '../game/config/dayConfigs';
import { clamp, uid } from '../utils/helpers';

const createInitialTransitionState = (): TransitionState => ({
  isActive: false,
  currentDay: 0,
  nextDay: 1,
  budget: 0,
  maxBudget: 0,
  selectedPurchases: [],
  availablePurchases: [...prepItems],
  staffOptions: [...staffConfigs],
  selectedStaff: [],
  previousDayStats: null,
  carriedCats: [],
  carriedEnvironment: {
    litterCleanliness: 100,
    foodSupply: 100,
    machineDurability: 100,
    machineBroken: false,
    machineRepairTime: 0,
    hygiene: 100,
  },
  carriedUnlockedDrinks: [],
  carriedComplaints: 0,
  predictedEvent: null,
});

export const useTransitionStore = create<TransitionState & TransitionActions>((set, get) => ({
  ...createInitialTransitionState(),

  enterTransition: (weekState, dayStats, cats, environment, unlockedDrinks, complaints) => {
    const nextDay = dayStats.day + 1;
    const budgetBonus = weekDailyBudgetBonus[weekState.difficulty];
    const earnedBudget = Math.round(dayStats.revenue * budgetBonus);
    const carriedBudget = weekState.budget;
    const totalBudget = carriedBudget + earnedBudget;

    const predictedEvent = nextDay <= 7 ? pickRandomBusinessEvent(nextDay) : 'none';

    set({
      isActive: true,
      currentDay: dayStats.day,
      nextDay,
      budget: totalBudget,
      maxBudget: totalBudget,
      selectedPurchases: [],
      availablePurchases: [...prepItems],
      staffOptions: [...staffConfigs],
      selectedStaff: [],
      previousDayStats: dayStats,
      carriedCats: cats.map((c) => ({ ...c })),
      carriedEnvironment: { ...environment },
      carriedUnlockedDrinks: [...unlockedDrinks],
      carriedComplaints: complaints,
      predictedEvent,
    });
  },

  getBudgetRemaining: () => {
    const s = get();
    const purchaseCost = s.selectedPurchases.reduce((sum, p) => sum + p.cost, 0);
    const staffCost = s.selectedStaff.reduce((sum, st) => sum + st.dailyCost, 0);
    return s.budget - purchaseCost - staffCost;
  },

  addPurchase: (purchase) => {
    const remaining = get().getBudgetRemaining();
    if (remaining < purchase.cost) return false;

    set((s) => ({
      selectedPurchases: [...s.selectedPurchases, purchase],
    }));
    return true;
  },

  removePurchase: (purchaseId) => {
    set((s) => ({
      selectedPurchases: s.selectedPurchases.filter((p) => p.id !== purchaseId),
    }));
  },

  setStaffStrategy: (staffId, strategy) => {
    set((s) => ({
      selectedStaff: s.selectedStaff.map((st) => {
        if (st.id !== staffId) return st;
        const config = staffConfigs.find((c) => c.strategy === strategy);
        if (!config) return st;
        return {
          ...st,
          strategy,
          name: config.name,
          emoji: config.emoji,
          efficiency: config.efficiency,
          errorRate: config.errorRate,
          dailyCost: config.dailyCost,
        };
      }),
    }));
  },

  addStaff: (config) => {
    const remaining = get().getBudgetRemaining();
    if (remaining < config.dailyCost) return false;
    if (get().selectedStaff.length >= 2) return false;

    const newStaff: Staff = {
      id: uid('staff'),
      name: config.name,
      emoji: config.emoji,
      strategy: config.strategy,
      efficiency: config.efficiency,
      errorRate: config.errorRate,
      dailyCost: config.dailyCost,
    };

    set((s) => ({
      selectedStaff: [...s.selectedStaff, newStaff],
    }));
    return true;
  },

  removeStaff: (staffId) => {
    set((s) => ({
      selectedStaff: s.selectedStaff.filter((st) => st.id !== staffId),
    }));
  },

  applyEffectsAndProceed: () => {
    const s = get();
    let cats = s.carriedCats.map((c) => ({ ...c }));
    const environment = { ...s.carriedEnvironment };
    const unlockedDrinks = [...s.carriedUnlockedDrinks];
    const complaints = s.carriedComplaints;

    for (const purchase of s.selectedPurchases) {
      const eff = purchase.effect;
      if (eff.foodSupply !== undefined) {
        environment.foodSupply = clamp(environment.foodSupply + eff.foodSupply, 0, 100);
      }
      if (eff.hygiene !== undefined) {
        environment.hygiene = clamp(environment.hygiene + eff.hygiene, 0, 100);
      }
      if (eff.litterCleanliness !== undefined) {
        environment.litterCleanliness = clamp(environment.litterCleanliness + eff.litterCleanliness, 0, 100);
      }
      if (eff.machineDurability !== undefined) {
        environment.machineDurability = clamp(environment.machineDurability + eff.machineDurability, 0, 100);
      }
      if (eff.catHealth !== undefined) {
        cats = cats.map((c) => ({
          ...c,
          health: clamp(c.health + eff.catHealth!, 0, 100),
        }));
      }
      if (eff.catMood !== undefined) {
        cats = cats.map((c) => ({
          ...c,
          mood: clamp(c.mood + eff.catMood!, 0, 100),
        }));
      }
      if (eff.catCureAll) {
        cats = cats.map((c) => ({ ...c, isSick: false, health: clamp(c.health + 30, 0, 100) }));
      }
    }

    const purchaseCost = s.selectedPurchases.reduce((sum, p) => sum + p.cost, 0);
    const staffCost = s.selectedStaff.reduce((sum, st) => sum + st.dailyCost, 0);
    const remainingBudget = s.budget - purchaseCost - staffCost;

    const nextEvent: BusinessEvent = s.predictedEvent || 'none';
    const selectedStaffCopy = s.selectedStaff.map((st) => ({ ...st }));

    set(createInitialTransitionState());

    return {
      cats,
      environment,
      unlockedDrinks,
      complaints,
      budget: remainingBudget,
      staff: selectedStaffCopy,
      nextEvent,
      totalPurchaseCost: purchaseCost,
      totalStaffCost: staffCost,
    };
  },

  reset: () => set(createInitialTransitionState()),
}));
