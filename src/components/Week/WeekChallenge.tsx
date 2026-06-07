import { useState, useEffect } from 'react';
import { useWeekStore } from '../../store/weekStore';
import { useDailyStore } from '../../store/dailyStore';
import { useTransitionStore } from '../../store/transitionStore';
import { WeekGameScene } from './WeekGameScene';
import { DayPrepPanel } from './DayPrepPanel';
import { WeekReviewPanel } from './WeekReviewPanel';
import { weekEventSystem } from '../../game/systems/WeekEventSystem';
import { pickRandomBusinessEvent } from '../../game/config/businessEvents';
import type { BusinessEvent, DailyStats, Staff } from '../../game/types/game';
import type { Difficulty } from '../../game/types/game';

type WeekPhase = 'prep' | 'business' | 'review';

interface WeekChallengeProps {
  difficulty: Difficulty;
  onExit: () => void;
  existingWeekId?: string;
}

export function WeekChallenge({ difficulty, onExit, existingWeekId }: WeekChallengeProps) {
  const [phase, setPhase] = useState<WeekPhase>('prep');
  const [finalScore, setFinalScore] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [, setCurrentStaff] = useState<Staff[]>([]);
  const [, setCurrentEvent] = useState<BusinessEvent>('none');

  const {
    startWeek,
    currentDay,
    totalDays,
    budget,
    commitDailyStats,
    finishWeek,
    loadArchive,
    cats,
    reset: resetWeek,
  } = useWeekStore();

  const { startDay, endDay } = useDailyStore();
  const { enterTransition, applyEffectsAndProceed, reset: resetTransition } = useTransitionStore();

  useEffect(() => {
    if (existingWeekId) {
      loadArchive(existingWeekId);
    } else {
      startWeek(difficulty);
    }
    return () => {
      weekEventSystem.stop();
    };
  }, [difficulty, existingWeekId, startWeek, loadArchive]);

  const handleStartFirstDay = () => {
    const day = useWeekStore.getState().currentDay;
    const weekState = useWeekStore.getState();
    const event = pickRandomBusinessEvent(day);
    setCurrentEvent(event);
    setCurrentStaff([]);
    startDay(day, weekState, event, []);
    weekEventSystem.reset();
    weekEventSystem.start();
    setPhase('business');
  };

  const handleDayEnd = () => {
    weekEventSystem.stop();
    const dayStats: DailyStats = endDay();
    const dailyState = useDailyStore.getState();
    const weekState = useWeekStore.getState();

    const prepCost = 0;
    commitDailyStats(
      dayStats,
      dailyState.cats,
      dailyState.environment,
      dailyState.unlockedDrinks,
      weekState.budget,
      prepCost
    );

    const day = useWeekStore.getState().currentDay - 1;
    if (day >= totalDays) {
      const result = finishWeek();
      setFinalScore(result.score);
      setIsNewBest(result.isBest);
      setPhase('review');
    } else {
      const ws = useWeekStore.getState();
      enterTransition(
        ws,
        dayStats,
        dailyState.cats,
        dailyState.environment,
        dailyState.unlockedDrinks,
        ws.totalComplaints
      );
      setPhase('prep');
    }
  };

  const handleProceedFromPrep = () => {
    const result = applyEffectsAndProceed();
    const weekState = useWeekStore.getState();
    const day = weekState.currentDay;

    setCurrentStaff(result.staff);
    setCurrentEvent(result.nextEvent);

    startDay(day, weekState, result.nextEvent, result.staff);
    resetTransition();
    weekEventSystem.reset();
    weekEventSystem.start();
    setPhase('business');
  };

  const handleReviewExit = () => {
    weekEventSystem.stop();
    resetWeek();
    resetTransition();
    onExit();
  };

  if (phase === 'business') {
    return <WeekGameScene onDayEnd={handleDayEnd} />;
  }

  if (phase === 'review') {
    return (
      <WeekReviewPanel
        onBackToMenu={handleReviewExit}
        isNewBest={isNewBest}
        finalScore={finalScore}
      />
    );
  }

  return (
    <>
      {currentDay === 1 && !useTransitionStore.getState().isActive ? (
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-warm-50 to-amber-50 flex flex-col items-center justify-center">
          <div className="max-w-2xl w-full card-cute p-8 text-center">
            <div className="text-7xl mb-4 animate-bounce-slow">🐱☕</div>
            <h1 className="font-cute text-4xl text-warm-400 mb-2">七日经营挑战</h1>
            <p className="text-gray-500 mb-6">
              连续经营 7 天猫咪咖啡馆，照顾好猫咪、服务好顾客、管理好预算！
            </p>
            <div className="grid grid-cols-3 gap-3 mb-8 text-sm">
              <div className="bg-warm-50 rounded-xl p-3">
                <div className="text-2xl mb-1">💰</div>
                <div className="text-xs text-gray-500">起始预算</div>
                <div className="font-bold text-warm-400 text-lg">¥{budget}</div>
              </div>
              <div className="bg-matcha-50 rounded-xl p-3">
                <div className="text-2xl mb-1">📅</div>
                <div className="text-xs text-gray-500">经营天数</div>
                <div className="font-bold text-matcha-300 text-lg">{totalDays} 天</div>
              </div>
              <div className="bg-rose-50 rounded-xl p-3">
                <div className="text-2xl mb-1">🐱</div>
                <div className="text-xs text-gray-500">猫咪数量</div>
                <div className="font-bold text-rose-catDark text-lg">{cats.length} 只</div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={handleStartFirstDay} className="btn-primary text-lg py-4 px-10">
                ☀️ 开始第 1 天
              </button>
              <button onClick={handleReviewExit} className="btn-secondary text-lg py-4 px-10">
                🏠 返回
              </button>
            </div>
          </div>
        </div>
      ) : (
        <DayPrepPanel onProceed={handleProceedFromPrep} />
      )}
    </>
  );
}
