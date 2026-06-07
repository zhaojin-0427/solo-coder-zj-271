import { useGameStore } from '../../store/gameStore';
import { dayConfigs } from '../../game/config/dayConfigs';
import { formatTime, getMoodColor } from '../../utils/helpers';

export function TopBar() {
  const {
    timeRemaining,
    satisfaction,
    revenue,
    difficulty,
    cats,
    isPaused,
    isHoliday,
    togglePause,
    customers,
  } = useGameStore();

  const config = dayConfigs[difficulty];
  const avgCatMood = Math.round(cats.reduce((sum, c) => sum + c.mood, 0) / cats.length);

  const progressColor = satisfaction >= 70 ? 'bg-matcha-200' : satisfaction >= 40 ? 'bg-warm-200' : 'bg-rose-400';

  return (
    <div className="w-full bg-white/95 backdrop-blur-md shadow-lg border-b-4 border-warm-100 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-bounce-slow">🐱</div>
          <div>
            <div className="font-cute text-xl text-warm-400">{config.dayName}</div>
            {isHoliday && (
              <div className="text-xs text-matcha-300 font-bold">🎉 节假日 +30%收入</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 bg-warm-50 px-4 py-2 rounded-full">
            <span className="text-xl">⏰</span>
            <span className={`font-bold text-lg ${timeRemaining < 20 ? 'text-rose-500 animate-pulse' : 'text-cocoa-200'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-warm-50 px-4 py-2 rounded-full min-w-[180px]">
            <span className="text-xl">😊</span>
            <div className="flex-1">
              <div className="progress-bar h-2">
                <div
                  className={`progress-fill ${progressColor}`}
                  style={{ width: `${satisfaction}%` }}
                />
              </div>
            </div>
            <span className="font-bold text-cocoa-200 text-sm min-w-[36px]">{Math.round(satisfaction)}%</span>
          </div>

          <div className="flex items-center gap-2 bg-matcha-50 px-4 py-2 rounded-full">
            <span className="text-xl">💰</span>
            <span className="font-bold text-lg text-matcha-300">¥{revenue}</span>
            <span className="text-xs text-gray-500">/ 目标¥{config.targetRevenue}</span>
          </div>

          <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-full">
            <span className="text-xl">🐱</span>
            <div className={`w-16 h-2 rounded-full bg-gray-200 overflow-hidden`}>
              <div className={`h-full ${getMoodColor(avgCatMood)} transition-all`} style={{ width: `${avgCatMood}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-warm-50 px-4 py-2 rounded-full">
            <span className="text-xl">👥</span>
            <span className="font-bold text-cocoa-200">{customers.length}/6</span>
          </div>
        </div>

        <button
          onClick={togglePause}
          className="btn-secondary flex items-center gap-2"
        >
          {isPaused ? '▶️ 继续' : '⏸️ 暂停'}
        </button>
      </div>
    </div>
  );
}
