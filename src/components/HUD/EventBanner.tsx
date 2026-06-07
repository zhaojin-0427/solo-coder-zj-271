import { useGameStore } from '../../store/gameStore';

export function EventBanner() {
  const { currentEvent, eventMessage, isPaused } = useGameStore();

  if (isPaused) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 pointer-events-none">
        <div className="bg-white px-12 py-8 rounded-3xl shadow-2xl text-center pointer-events-auto">
          <div className="text-6xl mb-4">⏸️</div>
          <div className="font-cute text-3xl text-warm-400">游戏暂停</div>
          <div className="text-gray-500 mt-2">点击右上角按钮继续</div>
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
