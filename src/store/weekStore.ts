import { create } from 'zustand';
import type {
  WeekState,
  DailyStats,
  Difficulty,
  Cat,
  Environment,
  DrinkType,
  WeeklyArchive,
  BestWeekRecord,
} from '../game/types/game';
import { initialCats } from '../game/config/catData';
import { weekStartingBudget } from '../game/config/dayConfigs';
import {
  saveWeeklyArchive,
  loadWeeklyArchives,
  saveBestWeek,
  loadBestWeek,
  removeWeeklyArchive,
} from '../utils/storage';
import { uid, clamp } from '../utils/helpers';

export interface WeekActions {
  startWeek: (difficulty: Difficulty, name?: string) => void;
  updateStateBetweenDays: (updates: { cats?: Cat[]; environment?: Environment; budget?: number; unlockedDrinks?: DrinkType[]; totalComplaints?: number }) => void;
  commitDailyStats: (
    stats: DailyStats,
    cats: Cat[],
    environment: Environment,
    unlockedDrinks: DrinkType[],
    budget: number,
    prepCost: number
  ) => void;
  finishWeek: () => { score: number; isBest: boolean };
  saveArchive: () => string;
  loadArchive: (id: string) => boolean;
  deleteArchive: (id: string) => void;
  getArchives: () => WeeklyArchive[];
  getBestWeek: () => BestWeekRecord | null;
  calculateFinalScore: () => number;
  reset: () => void;
}

const createInitialWeekState = (): WeekState => ({
  id: '',
  createdAt: '',
  currentDay: 0,
  totalDays: 7,
  difficulty: 'normal',
  startingBudget: 400,
  budget: 400,
  cumulativeRevenue: 0,
  cumulativeProfit: 0,
  avgSatisfaction: 75,
  cats: initialCats.map((c) => ({ ...c })),
  unlockedDrinks: ['coffee', 'matcha', 'milkTea', 'cappuccino'],
  totalComplaints: 0,
  history: [],
  bestDay: null,
  worstDay: null,
  isComplete: false,
  finalScore: null,
  name: '',
  environment: {
    litterCleanliness: 100,
    foodSupply: 100,
    machineDurability: 100,
    machineBroken: false,
    machineRepairTime: 0,
    hygiene: 100,
  },
});

export const useWeekStore = create<WeekState & WeekActions>((set, get) => ({
  ...createInitialWeekState(),

  startWeek: (difficulty, name) => {
    const budget = weekStartingBudget[difficulty];
    set({
      ...createInitialWeekState(),
      id: uid('week'),
      createdAt: new Date().toLocaleString('zh-CN'),
      currentDay: 1,
      difficulty,
      startingBudget: budget,
      budget,
      name: name || `周挑战-${new Date().toLocaleDateString('zh-CN')}`,
    });
  },

  updateStateBetweenDays: (updates) => {
    set((s) => ({
      ...s,
      ...(updates.cats ? { cats: updates.cats.map((c) => ({ ...c })) } : {}),
      ...(updates.environment ? { environment: { ...updates.environment } } : {}),
      ...(updates.budget !== undefined ? { budget: updates.budget } : {}),
      ...(updates.unlockedDrinks ? { unlockedDrinks: [...updates.unlockedDrinks] } : {}),
      ...(updates.totalComplaints !== undefined ? { totalComplaints: updates.totalComplaints } : {}),
    }));
  },

  commitDailyStats: (stats, cats, environment, unlockedDrinks, budget, prepCost) => {
    stats.prepCost = prepCost;
    stats.netProfit = stats.revenue - stats.staffCost - prepCost;

    set((s) => {
      const newHistory = [...s.history, stats];
      const totalRevenue = newHistory.reduce((sum, st) => sum + st.revenue, 0);
      const totalProfit = newHistory.reduce((sum, st) => sum + st.netProfit, 0);
      const avgSat =
        newHistory.length > 0
          ? Math.round(newHistory.reduce((sum, st) => sum + st.satisfactionEnd, 0) / newHistory.length)
          : 75;

      let bestDay = s.bestDay;
      let worstDay = s.worstDay;

      if (newHistory.length === 1) {
        bestDay = stats.day;
        worstDay = stats.day;
      } else {
        const best = newHistory.reduce((a, b) => (a.netProfit >= b.netProfit ? a : b));
        const worst = newHistory.reduce((a, b) => (a.netProfit <= b.netProfit ? a : b));
        bestDay = best.day;
        worstDay = worst.day;
      }

      return {
        history: newHistory,
        cumulativeRevenue: totalRevenue,
        cumulativeProfit: totalProfit,
        avgSatisfaction: avgSat,
        bestDay,
        worstDay,
        totalComplaints: s.totalComplaints + stats.complaints,
        cats: cats.map((c) => ({ ...c })),
        unlockedDrinks: [...unlockedDrinks],
        environment: { ...environment },
        budget,
        currentDay: stats.day + 1,
        isComplete: stats.day >= s.totalDays,
      };
    });
  },

  calculateFinalScore: () => {
    const s = get();
    if (s.history.length === 0) return 0;

    const totalRevenue = s.cumulativeRevenue;
    const avgSat = s.avgSatisfaction;
    const profit = s.cumulativeProfit;
    const complaintPenalty = s.totalComplaints * 15;
    const perfectBonus = s.history.filter((d) => d.satisfactionEnd >= 90).length * 50;
    const completeBonus = s.isComplete ? 500 : 0;

    return Math.round(
      clamp(totalRevenue * 0.5 + avgSat * 15 + profit * 0.8 - complaintPenalty + perfectBonus + completeBonus, 0, 99999)
    );
  },

  finishWeek: () => {
    const score = get().calculateFinalScore();
    set({ isComplete: true, finalScore: score });

    const best = get().getBestWeek();
    const isBest = !best || score > best.finalScore;
    if (isBest) {
      const s = get();
      saveBestWeek({
        id: s.id,
        name: s.name,
        createdAt: s.createdAt,
        difficulty: s.difficulty,
        totalRevenue: s.cumulativeRevenue,
        avgSatisfaction: s.avgSatisfaction,
        finalScore: score,
        history: s.history,
      });
    }

    return { score, isBest };
  },

  saveArchive: () => {
    const s = get();
    const archive: WeeklyArchive = {
      id: s.id || uid('archive'),
      name: s.name,
      createdAt: s.createdAt || new Date().toLocaleString('zh-CN'),
      difficulty: s.difficulty,
      totalRevenue: s.cumulativeRevenue,
      totalProfit: s.cumulativeProfit,
      avgSatisfaction: s.avgSatisfaction,
      bestDayRevenue: Math.max(...s.history.map((d) => d.revenue), 0),
      daysCompleted: s.history.length,
      finalScore: s.finalScore || s.calculateFinalScore(),
      history: s.history,
      budget: s.budget,
      cats: s.cats.map((c) => ({ ...c })),
      unlockedDrinks: [...s.unlockedDrinks],
      totalComplaints: s.totalComplaints,
      currentEnvironment: { ...s.environment },
    };
    saveWeeklyArchive(archive);
    return archive.id;
  },

  loadArchive: (id) => {
    const archives = loadWeeklyArchives();
    const archive = archives.find((a) => a.id === id);
    if (!archive) return false;

    const bestDay = archive.history.length > 0
      ? archive.history.reduce((a, b) => (a.netProfit >= b.netProfit ? a : b)).day
      : null;
    const worstDay = archive.history.length > 0
      ? archive.history.reduce((a, b) => (a.netProfit <= b.netProfit ? a : b)).day
      : null;

    set({
      id: archive.id,
      createdAt: archive.createdAt,
      currentDay: archive.daysCompleted + 1,
      totalDays: 7,
      difficulty: archive.difficulty,
      startingBudget: weekStartingBudget[archive.difficulty],
      budget: archive.budget,
      cumulativeRevenue: archive.totalRevenue,
      cumulativeProfit: archive.totalProfit,
      avgSatisfaction: archive.avgSatisfaction,
      cats: archive.cats.map((c) => ({ ...c })),
      unlockedDrinks: [...archive.unlockedDrinks],
      totalComplaints: archive.totalComplaints,
      history: archive.history,
      bestDay,
      worstDay,
      isComplete: archive.daysCompleted >= 7,
      finalScore: archive.finalScore,
      name: archive.name,
      environment: archive.currentEnvironment ? { ...archive.currentEnvironment } : undefined,
    });
    return true;
  },

  deleteArchive: (id) => {
    removeWeeklyArchive(id);
  },

  getArchives: () => loadWeeklyArchives(),

  getBestWeek: () => loadBestWeek(),

  reset: () => set(createInitialWeekState()),
}));
