import type { CatKnowledge } from '../../game/types/game';

interface KnowledgeCardProps {
  knowledge: CatKnowledge;
  isFlipped: boolean;
  onToggle: () => void;
}

export function KnowledgeCard({ knowledge, isFlipped, onToggle }: KnowledgeCardProps) {
  return (
    <div
      className={`card-flip cursor-pointer h-64 ${isFlipped ? 'flipped' : ''}`}
      onClick={onToggle}
    >
      <div className="card-flip-inner">
        <div className="card-flip-front card-cute p-5 flex flex-col">
          <div className="text-5xl mb-3">{knowledge.emoji}</div>
          <div className="text-xs text-warm-400 font-bold mb-1">{knowledge.categoryName}</div>
          <h3 className="font-cute text-xl text-cocoa-200 mb-2 flex-1">{knowledge.title}</h3>
          <div className="text-xs text-gray-400 text-center pt-2 border-t border-warm-100">
            👆 点击翻转查看
          </div>
        </div>

        <div className="card-flip-back bg-gradient-to-br from-warm-200 to-warm-300 p-5 flex flex-col text-white">
          <div className="text-3xl mb-2">{knowledge.emoji}</div>
          <div className="text-xs opacity-80 mb-1">{knowledge.categoryName}</div>
          <h3 className="font-cute text-lg mb-3">{knowledge.title}</h3>
          <p className="text-sm flex-1 overflow-y-auto leading-relaxed opacity-95">
            {knowledge.content}
          </p>
          <div className="text-xs text-center pt-2 opacity-80 border-t border-white/30 mt-2">
            👆 点击翻回
          </div>
        </div>
      </div>
    </div>
  );
}
