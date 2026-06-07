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
    <div className="w-full bg-white/95 backdrop-blur-md shadow-lg border-b-4 border-warm-100 px-3 md:px-6 py-2 md:py-3 relative z-[60]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <div className="text-2xl md:text-3xl animate-bounce-slow">🐱</div>
          <div className="hidden sm:block">
            <div className="font-cute text-base md:text-xl text-warm-400">{config.dayName}</div>
            {isHoliday && (
              <div className="text-[10px] md:text-xs text-matcha-300 font-bold">🎉 节假日 +30%</div>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center gap-1.5 md:gap-3 flex-wrap justify-center">
          <div className="flex items-center gap-1 md:gap-2 bg-warm-50 px-2 md:px-4 py-1.5 md:py-2 rounded-full">
            <span className="text-base md:text-xl">⏰</span>
            <span className={`font-bold text-sm md:text-lg ${timeRemaining < 20 ? 'text-rose-500 animate-pulse' : 'text-cocoa-200'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-warm-50 px-4 py-2 rounded-full min-w-[180px]">
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
          <div className="flex md:hidden items-center gap-1 bg-warm-50 px-2 py-1 rounded-full">
            <span className="text-sm">😊</span>
            <span className="font-bold text-cocoa-200 text-xs">{Math.round(satisfaction)}%</span>
          </div>

          <div className="flex items-center gap-1 md:gap-2 bg-matcha-50 px-2 md:px-4 py-1.5 md:py-2 rounded-full">
            <span className="text-base md:text-xl">💰</span>
            <span className="font-bold text-sm md:text-lg text-matcha-300">¥{revenue}</span>
            <span className="hidden md:inline text-xs text-gray-500">/¥{config.targetRevenue}</span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-full">
            <span className="text-xl">🐱</span>
            <div className={`w-16 h-2 rounded-full bg-gray-200 overflow-hidden`}>
              <div className={`h-full ${getMoodColor(avgCatMood)} transition-all`} style={{ width: `${avgCatMood}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2 bg-warm-50 px-2 md:px-4 py-1.5 md:py-2 rounded-full">
            <span className="text-base md:text-xl">👥</span>
            <span className="font-bold text-xs md:text-base text-cocoa-200">{customers.length}/6</span>
          </div>
        </div>

        <button
          onClick={togglePause}
          className="flex-shrink-0 relative z-[70] px-3 md:px-5 py-1.5 md:py-2.5 rounded-full bg-gradient-to-r from-matcha-100 to-matcha-200 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95 text-xs md:text-base flex items-center gap-1 md:gap-2 min-h-[36px] md:min-h-[40px]"
        >
          {isPaused ? '▶️ 继续' : '⏸️ 暂停'}
        </button>
      </div>
    </div>
  );
}
