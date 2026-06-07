import { useGameStore } from '../../store/gameStore';

export function EventBanner() {
  const { currentEvent, eventMessage, isPaused } = useGameStore();

  if (isPaused) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 pointer-events-auto backdrop-blur-sm">
        <div className="bg-white px-8 py-8 md:px-12 md:py-10 rounded-3xl shadow-2xl text-center max-w-sm mx-4 animate-bounce-slow">
          <div className="text-6xl md:text-7xl mb-4">⏸️</div>
          <div className="font-cute text-3xl md:text-4xl text-warm-400 mb-2">游戏暂停</div>
          <div className="text-gray-500 text-sm md:text-base">点击右上角「继续」按钮恢复游戏</div>
        </div>
      </div>
    );
  }

  if (!currentEvent) return null;

  const bgColors: Record<string, string> = {
    catSick: 'from-rose-400 to-rose-500',
    customerComplaint: 'from-warm-200 to-warm-300',
    machineBreak: 'from-cocoa-100 to-cocoa-200',
    holiday: 'from-matcha-100 to-matcha-200',
  };

  return (
    <div className="fixed top-28 left-1/2 -translate-x-1/2 z-40 animate-bounce-slow">
      <div
        className={`px-8 py-4 rounded-2xl shadow-2xl text-white font-bold text-lg bg-gradient-to-r ${bgColors[currentEvent] || 'from-warm-200 to-warm-300'} border-4 border-white/50`}
      >
        {eventMessage}
      </div>
    </div>
  );
}
