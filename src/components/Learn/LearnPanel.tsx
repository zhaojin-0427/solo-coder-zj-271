import { useState } from 'react';
import { catKnowledge, knowledgeCategories } from '../../game/config/knowledgeData';
import type { CatKnowledge } from '../../game/types/game';
import { KnowledgeCard } from './KnowledgeCard';

interface LearnPanelProps {
  onBack: () => void;
}

export function LearnPanel({ onBack }: LearnPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const filteredKnowledge = selectedCategory
    ? catKnowledge.filter((k) => k.category === selectedCategory)
    : catKnowledge;

  const toggleCard = (id: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen p-6 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="btn-secondary">
            ← 返回菜单
          </button>
          <h1 className="font-cute text-4xl text-warm-400 flex items-center gap-3">
            📚 养猫知识小课堂
          </h1>
          <div className="w-24" />
        </div>

        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2 rounded-full font-bold transition-all ${
              selectedCategory === null
                ? 'bg-warm-200 text-white shadow-md scale-105'
                : 'bg-white text-cocoa-200 border-2 border-warm-100 hover:border-warm-200'
            }`}
          >
            🐱 全部 ({catKnowledge.length})
          </button>
          {knowledgeCategories.map((cat) => {
            const count = catKnowledge.filter((k) => k.category === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(selectedCategory === cat.key ? null : cat.key)}
                className={`px-5 py-2 rounded-full font-bold transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-warm-200 text-white shadow-md scale-105'
                    : 'bg-white text-cocoa-200 border-2 border-warm-100 hover:border-warm-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        <p className="text-center text-gray-500 mb-6 text-sm">
          💡 点击卡片翻转查看详细内容
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredKnowledge.map((knowledge: CatKnowledge) => (
            <KnowledgeCard
              key={knowledge.id}
              knowledge={knowledge}
              isFlipped={flippedCards.has(knowledge.id)}
              onToggle={() => toggleCard(knowledge.id)}
            />
          ))}
        </div>

        {filteredKnowledge.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🐾</div>
            <p>暂无该分类的知识</p>
          </div>
        )}
      </div>
    </div>
  );
}
