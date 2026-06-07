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

      <div className="flex-1 p-4 max-w-[1600px] mx-auto w-full">
        <div className="h-[calc(100vh-120px)] grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <CatPanel />
          </div>

          <div className="col-span-5 flex flex-col gap-4">
            <div className="card-cute p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-cute text-xl text-warm-400">🎯 今日目标</h2>
                <span className="text-xs text-gray-500">{config.dayName}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-warm-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500">满意度目标</div>
                  <div className="font-bold text-warm-400 text-lg">≥ {config.targetSatisfaction}%</div>
                </div>
                <div className="bg-matcha-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500">营收目标</div>
                  <div className="font-bold text-matcha-300 text-lg">≥ ¥{config.targetRevenue}</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic text-center">{config.description}</p>
            </div>

            <div className="flex-1 min-h-0">
              <CustomerQueue />
            </div>
          </div>

          <div className="col-span-4">
            <DrinkMaker />
          </div>
        </div>
      </div>
    </div>
  );
}
