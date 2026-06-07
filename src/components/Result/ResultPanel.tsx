import type { GameResult, Difficulty } from '../../game/types/game';
import { dayConfigs, difficultyLabels } from '../../game/config/dayConfigs';
import { eventSystem } from '../../game/systems/EventSystem';

interface ResultPanelProps {
  result: GameResult;
  difficulty: Difficulty;
  onRetry: () => void;
  onMenu: () => void;
  onNextLevel?: () => void;
}

export function ResultPanel({ result, difficulty, onRetry, onMenu, onNextLevel }: ResultPanelProps) {
  const config = dayConfigs[difficulty];
  const accuracy = result.totalDrinks > 0 ? Math.round((result.correctDrinks / result.totalDrinks) * 100) : 0;
  
  const nextDifficulty: Difficulty | null = difficulty === 'easy' ? 'normal' : difficulty === 'normal' ? 'hard' : null;
  const canGoNext = result.success && nextDifficulty;

  const handleRetry = () => {
    eventSystem.reset();
    eventSystem.start();
    onRetry();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="card-cute p-10 max-w-xl w-full text-center">
        <div className="text-7xl mb-4">
          {result.success ? '🎉' : '😿'}
        </div>
        
        {result.isNewHighScore && (
          <div className="bg-gradient-to-r from-warm-200 to-warm-300 text-white px-4 py-2 rounded-full inline-block mb-4 animate-pulse font-bold">
            🏆 新纪录!
          </div>
        )}

        <h1 className="font-cute text-4xl text-warm-400 mb-2">
          {result.success ? '经营成功!' : '再接再厉!'}
        </h1>
        <p className="text-gray-500 mb-6">{difficultyLabels[difficulty]}</p>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              className={`text-5xl transition-all ${star <= result.stars ? 'opacity-100 animate-bounce-slow' : 'opacity-20'}`}
              style={{ animationDelay: `${star * 0.2}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-warm-50 rounded-2xl p-4">
            <div className="text-3xl mb-1">😊</div>
            <div className="text-xs text-gray-500">满意度</div>
            <div className="font-cute text-2xl text-warm-400">{Math.round(result.satisfaction)}%</div>
            <div className="text-xs text-gray-400">目标 {config.targetSatisfaction}%</div>
          </div>
          <div className="bg-matcha-50 rounded-2xl p-4">
            <div className="text-3xl mb-1">💰</div>
            <div className="text-xs text-gray-500">营收</div>
            <div className="font-cute text-2xl text-matcha-300">¥{result.revenue}</div>
            <div className="text-xs text-gray-400">目标 ¥{config.targetRevenue}</div>
          </div>
          <div className="bg-rose-50 rounded-2xl p-4">
            <div className="text-3xl mb-1">👥</div>
            <div className="text-xs text-gray-500">服务顾客</div>
            <div className="font-cute text-2xl text-rose-catDark">{result.customersServed}位</div>
          </div>
          <div className="bg-cocoa-50 rounded-2xl p-4">
            <div className="text-3xl mb-1">☕</div>
            <div className="text-xs text-gray-500">正确率</div>
            <div className="font-cute text-2xl text-cocoa-100">{accuracy}%</div>
            <div className="text-xs text-gray-400">{result.correctDrinks}/{result.totalDrinks}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {canGoNext && (
            <button onClick={onNextLevel} className="btn-primary text-lg py-3">
              ⚡ 挑战{difficultyLabels[nextDifficulty!]}
            </button>
          )}
          <div className="flex gap-3">
            <button onClick={handleRetry} className="btn-secondary flex-1">
              🔄 再玩一次
            </button>
            <button onClick={onMenu} className="btn-secondary flex-1">
              🏠 返回菜单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
