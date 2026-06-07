import { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { TopBar } from '../HUD/TopBar';
import { CatPanel } from '../HUD/CatPanel';
import { CustomerQueue } from '../HUD/CustomerQueue';
import { DrinkMaker } from '../HUD/DrinkMaker';
import { Notifications } from '../HUD/Notifications';
import { EventBanner } from '../HUD/EventBanner';
import { dayConfigs } from '../../game/config/dayConfigs';
import type { GameResult, Difficulty } from '../../game/types/game';
import { eventSystem } from '../../game/systems/EventSystem';

interface GameSceneProps {
  onGameEnd: (result: GameResult, difficulty: Difficulty) => void;
}

export function GameScene({ onGameEnd }: GameSceneProps) {
  const { timeRemaining, difficulty, endGame, isPaused } = useGameStore();

  useEffect(() => {
    if (timeRemaining <= 0 && !isPaused) {
      eventSystem.stop();
      const result = endGame();
      setTimeout(() => {
        onGameEnd(result, difficulty);
      }, 500);
    }
  }, [timeRemaining, isPaused, endGame, difficulty, onGameEnd]);

  const config = dayConfigs[difficulty];

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <EventBanner />
      <Notifications />

      <div className="flex-1 p-2 md:p-4 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-4 auto-rows-min">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <CatPanel />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-2 md:gap-4 order-1 lg:order-2">
            <div className="card-cute p-3 md:p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-cute text-lg md:text-xl text-warm-400">🎯 今日目标</h2>
                <span className="text-xs text-gray-500">{config.dayName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-4 text-sm">
                <div className="bg-warm-50 rounded-xl p-2 md:p-3">
                  <div className="text-xs text-gray-500">满意度目标</div>
                  <div className="font-bold text-warm-400 text-base md:text-lg">≥ {config.targetSatisfaction}%</div>
                </div>
                <div className="bg-matcha-50 rounded-xl p-2 md:p-3">
                  <div className="text-xs text-gray-500">营收目标</div>
                  <div className="font-bold text-matcha-300 text-base md:text-lg">≥ ¥{config.targetRevenue}</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic text-center">{config.description}</p>
            </div>

            <div className="min-h-[280px] md:min-h-0 md:flex-1">
              <CustomerQueue />
            </div>
          </div>

          <div className="lg:col-span-4 order-3">
            <DrinkMaker />
          </div>
        </div>
      </div>
    </div>
  );
}
