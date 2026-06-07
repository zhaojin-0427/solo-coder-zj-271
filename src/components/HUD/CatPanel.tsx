import { useGameStore } from '../../store/gameStore';
import { getMoodColor, getCatOverallStatus } from '../../utils/helpers';
import type { CatAction } from '../../game/types/game';
import { catPersonalityQuotes } from '../../game/config/catData';
import { randomChoice } from '../../utils/helpers';
import { useState } from 'react';

export function CatPanel() {
  const { cats, interactWithCat, environment } = useGameStore();
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const handleAction = (catId: string, action: CatAction) => {
    interactWithCat(catId, action);
  };

  const toggleExpand = (catId: string) => {
    setExpandedCat(expandedCat === catId ? null : catId);
  };

  return (
    <div className="card-cute p-3 md:p-4">
      <h2 className="font-cute text-lg md:text-xl text-warm-400 mb-2 md:mb-3 flex items-center gap-2">
        🐾 我的猫咪们
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
        {cats.map((cat) => {
          const status = getCatOverallStatus(cat);
          const borderColor = status === 'good' ? 'border-matcha-100' : status === 'okay' ? 'border-warm-100' : 'border-rose-200';
          const bgColor = status === 'good' ? 'bg-matcha-50' : status === 'okay' ? 'bg-warm-50' : 'bg-rose-50';
          const isExpanded = expandedCat === cat.id;
          
          return (
            <div
              key={cat.id}
              className={`relative rounded-2xl p-2 md:p-3 border-2 md:border-3 transition-all duration-300 cursor-pointer ${borderColor} ${bgColor} ${
                isExpanded ? 'ring-2 ring-warm-200 shadow-lg scale-[1.02]' : 'hover:scale-[1.01]'
              }`}
              onClick={() => toggleExpand(cat.id)}
            >
              {cat.isSick && (
                <div className="absolute -top-2 -right-2 text-2xl md:text-2xl animate-bounce z-10">🤒</div>
              )}
              
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-3xl md:text-4xl ${cat.mood >= 70 ? 'animate-bounce-slow' : ''}`}>
                  {cat.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-cocoa-200 text-sm md:text-base truncate">{cat.name}</div>
                  <div className="text-[10px] md:text-xs text-gray-500 truncate">
                    {cat.personality === 'lazy' ? '😴 懒猫' : cat.personality === 'playful' ? '🎾 爱玩' : cat.personality === 'shy' ? '🙈 害羞' : '💝 亲人'}
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-[10px] md:text-xs">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="w-5 md:w-8 text-base md:text-base">😊</span>
                  <div className="flex-1 progress-bar">
                    <div className={`progress-fill ${getMoodColor(cat.mood)}`} style={{ width: `${cat.mood}%` }} />
                  </div>
                  <span className="w-6 md:w-8 text-right text-[10px] md:text-xs">{Math.round(cat.mood)}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="w-5 md:w-8 text-base md:text-base">🍽️</span>
                  <div className="flex-1 progress-bar">
                    <div className={`progress-fill ${getMoodColor(cat.hunger)}`} style={{ width: `${cat.hunger}%` }} />
                  </div>
                  <span className="w-6 md:w-8 text-right text-[10px] md:text-xs">{Math.round(cat.hunger)}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="w-5 md:w-8 text-base md:text-base">❤️</span>
                  <div className="flex-1 progress-bar">
                    <div className={`progress-fill ${getMoodColor(cat.health)}`} style={{ width: `${cat.health}%` }} />
                  </div>
                  <span className="w-6 md:w-8 text-right text-[10px] md:text-xs">{Math.round(cat.health)}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-2 md:mt-3 pt-2 border-t border-warm-100" onClick={(e) => e.stopPropagation()}>
                  <div className="text-[10px] md:text-xs text-gray-500 mb-2 italic">
                    "{randomChoice(catPersonalityQuotes[cat.personality])}"
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAction(cat.id, 'pet'); }}
                      className="bg-rose-cat hover:bg-rose-catDark active:bg-rose-catDark text-white text-[11px] md:text-xs py-2 md:py-1.5 px-2 md:px-2 rounded-full transition-all active:scale-95 min-h-[36px]"
                    >
                      🤚 摸摸
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAction(cat.id, 'feed'); }}
                      disabled={environment.foodSupply < 10}
                      className="bg-warm-200 hover:bg-warm-300 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[11px] md:text-xs py-2 md:py-1.5 px-2 md:px-2 rounded-full transition-all active:scale-95 min-h-[36px]"
                    >
                      🍽️ 喂食
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAction(cat.id, 'play'); }}
                      className="bg-matcha-200 hover:bg-matcha-300 active:bg-matcha-300 text-white text-[11px] md:text-xs py-2 md:py-1.5 px-2 md:px-2 rounded-full transition-all active:scale-95 min-h-[36px]"
                    >
                      🎾 玩耍
                    </button>
                    {(cat.isSick || cat.health < 80) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAction(cat.id, 'heal'); }}
                        className="bg-cocoa-100 hover:bg-cocoa-200 active:bg-cocoa-200 text-white text-[11px] md:text-xs py-2 md:py-1.5 px-2 md:px-2 rounded-full transition-all active:scale-95 min-h-[36px] animate-pulse"
                      >
                        💊 治疗
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
