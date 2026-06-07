import { useState } from 'react';
import { useGameStore, loadHighScores } from '../../store/gameStore';
import { dayConfigs, difficultyList, difficultyLabels, difficultyColors } from '../../game/config/dayConfigs';
import type { Difficulty } from '../../game/types/game';
import { eventSystem } from '../../game/systems/EventSystem';
import type { HighScore } from '../../game/types/game';

interface MainMenuProps {
  onStartGame: (difficulty: Difficulty) => void;
  onOpenLearn: () => void;
}

export function MainMenu({ onStartGame, onOpenLearn }: MainMenuProps) {
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [highScores] = useState<Record<Difficulty, HighScore | null>>(() => loadHighScores());
  const startGame = useGameStore((s) => s.startGame);

  const handleStart = (difficulty: Difficulty) => {
    startGame(difficulty);
    eventSystem.reset();
    eventSystem.start();
    onStartGame(difficulty);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['🐱', '☕', '🧋', '🍵', '🐾', '💕', '🎀', '⭐'].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-20 animate-float"
            style={{
              left: `${(i * 13 + 5) % 90}%`,
              top: `${(i * 17 + 10) % 80}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center">
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-bounce-slow">🐱☕</div>
          <h1 className="font-cute text-6xl text-warm-400 mb-2 text-shadow">
            猫咪咖啡馆
          </h1>
          <p className="font-cute text-2xl text-cocoa-100">经营与顾客满意度挑战</p>
        </div>

        {!showDifficulty && !showHighScores && !showHelp && (
          <div className="flex flex-col gap-4 w-80 mx-auto">
            <button onClick={() => setShowDifficulty(true)} className="btn-primary text-xl py-4">
              🎮 开始游戏
            </button>
            <button onClick={onOpenLearn} className="btn-secondary text-lg">
              📚 养猫知识学习
            </button>
            <button onClick={() => setShowHighScores(true)} className="btn-secondary text-lg">
              🏆 最高分记录
            </button>
            <button onClick={() => setShowHelp(true)} className="btn-secondary text-lg">
              ❓ 游戏说明
            </button>
          </div>
        )}

        {showDifficulty && (
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="font-cute text-3xl text-warm-400 mb-6">选择难度</h2>
            <div className="grid gap-4 mb-6">
              {difficultyList.map((diff) => {
                const config = dayConfigs[diff];
                const score = highScores[diff];
                return (
                  <button
                    key={diff}
                    onClick={() => handleStart(diff)}
                    className={`p-5 rounded-3xl text-left bg-gradient-to-r ${difficultyColors[diff]} text-white shadow-xl hover:scale-[1.02] transition-all active:scale-95`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-cute text-2xl mb-1">{difficultyLabels[diff]}</div>
                        <div className="text-sm opacity-90 mb-2">{config.description}</div>
                        <div className="text-xs opacity-80 flex gap-4">
                          <span>⏰ {config.duration}秒</span>
                          <span>🎯 满意度≥{config.targetSatisfaction}%</span>
                          <span>💰 营收≥¥{config.targetRevenue}</span>
                        </div>
                      </div>
                      {score && (
                        <div className="text-right">
                          <div className="text-xs opacity-80">最高分</div>
                          <div className="font-bold text-2xl">{score.score}</div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setShowDifficulty(false)} className="btn-secondary">
              ← 返回
            </button>
          </div>
        )}

        {showHighScores && (
          <div className="w-full max-w-lg mx-auto">
            <h2 className="font-cute text-3xl text-warm-400 mb-6">🏆 最高分记录</h2>
            <div className="card-cute p-6 mb-6">
              {difficultyList.map((diff) => {
                const score = highScores[diff];
                return (
                  <div key={diff} className="py-3 border-b border-warm-100 last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="font-cute text-xl text-warm-400">{difficultyLabels[diff]}</span>
                      {score ? (
                        <div className="text-right">
                          <div className="font-bold text-2xl text-matcha-300">{score.score}分</div>
                          <div className="text-xs text-gray-500">
                            💰¥{score.revenue} · 😊{score.satisfaction}% · 👥{score.customersServed}位
                          </div>
                          <div className="text-xs text-gray-400">{score.date}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">暂无记录</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setShowHighScores(false)} className="btn-secondary">
              ← 返回
            </button>
          </div>
        )}

        {showHelp && (
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="font-cute text-3xl text-warm-400 mb-6">❓ 游戏说明</h2>
            <div className="card-cute p-6 mb-6 text-left text-sm space-y-4">
              <div>
                <h3 className="font-bold text-cocoa-200 text-lg mb-2">🎯 游戏目标</h3>
                <p className="text-gray-600">在限定时间内，同时满足目标满意度和目标营收即可通关！</p>
              </div>
              <div>
                <h3 className="font-bold text-cocoa-200 text-lg mb-2">☕ 制作饮品</h3>
                <p className="text-gray-600">点击顾客查看订单 → 选择正确的饮品类型和温度 → 点击送出饮品。正确可获得金币和满意度，做错会降低满意度。</p>
              </div>
              <div>
                <h3 className="font-bold text-cocoa-200 text-lg mb-2">🐱 照顾猫咪</h3>
                <p className="text-gray-600">鼠标悬停猫咪卡片可以互动：摸摸、喂食、玩耍、治疗。猫咪心情好时，顾客可能会要求合影，获得额外收入！</p>
              </div>
              <div>
                <h3 className="font-bold text-cocoa-200 text-lg mb-2">🧹 维护环境</h3>
                <p className="text-gray-600">及时清理猫砂盆和补充猫粮，环境脏乱会降低顾客满意度和猫咪心情。</p>
              </div>
              <div>
                <h3 className="font-bold text-cocoa-200 text-lg mb-2">⚠️ 随机事件</h3>
                <p className="text-gray-600">游戏中可能出现：猫咪生病🤒、顾客投诉😤、咖啡机故障🔧、节假日客流高峰🎉。灵活应对吧！</p>
              </div>
            </div>
            <button onClick={() => setShowHelp(false)} className="btn-secondary">
              ← 返回
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
