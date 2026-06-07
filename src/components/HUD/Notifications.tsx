import { useGameStore } from '../../store/gameStore';

export function Notifications() {
  const { notifications } = useGameStore();

  const bgColors = {
    success: 'bg-matcha-200 border-matcha-300',
    error: 'bg-rose-400 border-rose-500',
    warning: 'bg-warm-200 border-warm-300',
    info: 'bg-blue-400 border-blue-500',
  };

  return (
    <div className="fixed top-24 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map((notif, idx) => (
        <div
          key={notif.id}
          className={`px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg border-2 ${bgColors[notif.type]} animate-bounce-slow`}
          style={{
            animation: `slideIn 0.3s ease-out, fadeOut 0.5s ease-in 2.5s forwards`,
            animationDelay: `${idx * 0.05}s`,
          }}
        >
          {notif.message}
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          to { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
