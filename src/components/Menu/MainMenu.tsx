import { useState } from 'react';
import { useGameStore, loadHighScores } from '../../store/gameStore';
import { dayConfigs, difficultyList, difficultyLabels, difficultyColors, weekDifficultyLabels, weekStartingBudget } from '../../game/config/dayConfigs';
import type { Difficulty } from '../../game/types/game';
import { eventSystem } from '../../game/systems/EventSystem';
import type { HighScore, WeeklyArchive } from '../../game/types/game';
import { loadWeeklyArchives, loadBestWeek } from '../../utils/storage';

interface MainMenuProps {
  onStartGame: (difficulty: Difficulty) => void;
  onStartWeek: (difficulty: Difficulty) => void;
  onLoadWeek: (id: string) => void;
  onOpenLearn: () => void;
}

type ViewMode = 'main' | 'singleDay' | 'weekChallenge' | 'weekArchives' | 'highScores' | 'help';

export function MainMenu({ onStartGame, onStartWeek, onLoadWeek, onOpenLearn }: MainMenuProps) {
  const [view, setView] = useState<ViewMode>('main');
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [highScores] = useState<Record<Difficulty, HighScore | null>>(() => loadHighScores());
  const [archives] = useState<WeeklyArchive[]>(() => loadWeeklyArchives());
  const [bestWeek] = useState(() => loadBestWeek());
  const startGame = useGameStore((s) => s.startGame);

  const handleStartSingle = (difficulty: Difficulty) => {
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

      <div className="relative z-10 text-center w-full max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-bounce-slow">🐱☕</div>
          <h1 className="font-cute text-6xl text-warm-400 mb-2 text-shadow">猫咪咖啡馆</h1>
          <p className="font-cute text-2xl text-cocoa-100">经营与顾客满意度挑战</p>
        </div>

        {view === 'main' && (
          <div className="flex flex-col gap-4 w-80 mx-auto">
            <button onClick={() => { setView('singleDay'); setShowDifficulty(true); }} className="btn-primary text-xl py-4">
              🎮 单日挑战
            </button>
            <button onClick={() => setView('weekChallenge')} className="btn-secondary text-lg bg-gradient-to-r from-purple-100 to-purple-200 text-white">
              📅 七日经营周挑战 🆕
            </button>
            <button onClick={onOpenLearn} className="btn-secondary text-lg">
              📚 养猫知识学习
            </button>
            <button onClick={() => setView('highScores')} className="btn-secondary text-lg">
              🏆 最高分记录
            </button>
            <button onClick={() => setView('help')} className="btn-secondary text-lg">
              ❓ 游戏说明
            </button>
          </div>
        )}

        {view === 'singleDay' && showDifficulty && (
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="font-cute text-3xl text-warm-400 mb-6">选择单日难度</h2>
            <div className="grid gap-4 mb-6">
              {difficultyList.map((diff) => {
                const config = dayConfigs[diff];
                const score = highScores[diff];
                return (
                  <button
                    key={diff}
                    onClick={() => handleStartSingle(diff)}
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
            <button onClick={() => { setView('main'); setShowDifficulty(false); }} className="btn-secondary">
              ← 返回
            </button>
          </div>
        )}

        {view === 'weekChallenge' && (
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="font-cute text-3xl text-warm-400 mb-2">📅 七日经营周挑战</h2>
            <p className="text-gray-500 mb-6">
              连续经营 7 天！猫咪状态、资金、满意度都要跨天继承。
              每天结算后可以采购物资和雇佣店员。
            </p>
            <div className="grid gap-4 mb-6">
              {difficultyList.map((diff) => (
                <button
                  key={diff}
                  onClick={() => onStartWeek(diff)}
                  className={`p-5 rounded-3xl text-left bg-gradient-to-r ${difficultyColors[diff]} text-white shadow-xl hover:scale-[1.02] transition-all active:scale-95`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-cute text-2xl mb-1">{weekDifficultyLabels[diff]}</div>
                      <div className="text-sm opacity-90 mb-2">连续经营 7 天，挑战持久经营能力！</div>
                      <div className="text-xs opacity-80 flex gap-4">
                        <span>💰 起始预算 ¥{weekStartingBudget[diff]}</span>
                        <span>📅 7 天挑战</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl">▶️</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {archives.length > 0 && (
              <div className="mb-6">
                <button onClick={() => setView('weekArchives')} className="btn-secondary w-full">
                  📂 查看存档 ({archives.length})
                </button>
              </div>
            )}

            {bestWeek && (
              <div className="card-cute p-4 mb-6 text-left bg-gradient-to-r from-amber-50 to-yellow-50">
                <div className="font-bold text-amber-600 mb-1">🏆 最佳经营周</div>
                <div className="text-sm text-gray-600 flex gap-4 flex-wrap">
                  <span>{bestWeek.name}</span>
                  <span>分数: <b className="text-amber-600">{bestWeek.finalScore}</b></span>
                  <span>营收: ¥{bestWeek.totalRevenue}</span>
                  <span>满意度: {bestWeek.avgSatisfaction}%</span>
                </div>
              </div>
            )}

            <button onClick={() => setView('main')} className="btn-secondary">
              ← 返回
            </button>
          </div>
        )}

        {view === 'weekArchives' && (
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="font-cute text-3xl text-warm-400 mb-6">📂 周挑战存档</h2>
            {archives.length === 0 ? (
              <p className="text-gray-500 mb-6">暂无存档</p>
            ) : (
              <div className="card-cute p-4 mb-6 max-h-96 overflow-y-auto space-y-3">
                {archives.map((arc) => (
                  <button
                    key={arc.id}
                    onClick={() => onLoadWeek(arc.id)}
                    className="w-full p-3 rounded-xl text-left bg-warm-50 hover:bg-warm-100 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-warm-400">{arc.name}</div>
                        <div className="text-xs text-gray-500">{arc.createdAt} · {weekDifficultyLabels[arc.difficulty]}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-matcha-300">{arc.finalScore}分</div>
                        <div className="text-xs text-gray-500">{arc.daysCompleted}/7天 · ¥{arc.totalRevenue}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setView('weekChallenge')} className="btn-secondary">
              ← 返回
            </button>
          </div>
        )}

        {view === 'highScores' && (
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
            <button onClick={() => setView('main')} className="btn-secondary">
              ← 返回
            </button>
          </div>
        )}

        {view === 'help' && (
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="font-cute text-3xl text-warm-400 mb-6">❓ 游戏说明</h2>
            <div className="card-cute p-6 mb-6 text-left text-sm space-y-4">
              <div>
                <h3 className="font-bold text-cocoa-200 text-lg mb-2">� 单日挑战模式</h3>
                <p className="text-gray-600">在限定时间内，同时满足目标满意度和目标营收即可通关！</p>
              </div>
              <div>
                <h3 className="font-bold text-cocoa-200 text-lg mb-2">📅 七日经营周挑战</h3>
                <p className="text-gray-600">连续经营 7 天，猫咪状态、预算、满意度都会跨天继承。每天结算后可在准备阶段采购猫粮、清洁用品、设备保养、猫咪治疗，并雇佣店员协助经营。注意各种经营事件（节日、暴雨、网红探店等）会影响客流与评分！</p>
              </div>
              <div>
                <h3 className="font-bold text-cocoa-200 text-lg mb-2">☕ 制作饮品</h3>
                <p className="text-gray-600">点击顾客查看订单 → 选择正确的饮品类型和温度 → 点击送出饮品。正确可获得金币和满意度，做错会降低满意度。</p>
              </div>
              <div>
                <h3 className="font-bold text-cocoa-200 text-lg mb-2">🐱 照顾猫咪</h3>
                <p className="text-gray-600">点击猫咪卡片可以互动：摸摸、喂食、玩耍、治疗。猫咪心情好时，顾客可能会要求合影，获得额外收入！</p>
              </div>
              <div>
                <h3 className="font-bold text-cocoa-200 text-lg mb-2">🧹 维护环境</h3>
                <p className="text-gray-600">及时清理猫砂盆、补充猫粮、维护设备和卫生，环境脏乱会降低顾客满意度和猫咪健康。</p>
              </div>
              <div>
                <h3 className="font-bold text-cocoa-200 text-lg mb-2">⚠️ 随机事件</h3>
                <p className="text-gray-600">游戏中可能出现：猫咪生病🤒、顾客投诉😤、咖啡机故障🔧。灵活应对吧！</p>
              </div>
            </div>
            <button onClick={() => setView('main')} className="btn-secondary">
              ← 返回
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
