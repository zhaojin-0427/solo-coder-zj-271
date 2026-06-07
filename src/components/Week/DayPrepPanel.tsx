import { useTransitionStore } from '../../store/transitionStore';
import { categoryLabels } from '../../game/config/prepItems';
import { businessEventConfigs } from '../../game/config/businessEvents';
import { staffStrategyLabels } from '../../game/config/staffConfigs';
import type { PrepCategory, StaffConfig } from '../../game/types/game';
import { weekDayConfigs } from '../../game/config/dayConfigs';

interface DayPrepPanelProps {
  onProceed: () => void;
}

export function DayPrepPanel({ onProceed }: DayPrepPanelProps) {
  const {
    currentDay,
    nextDay,
    maxBudget,
    selectedPurchases,
    availablePurchases,
    staffOptions,
    selectedStaff,
    previousDayStats,
    carriedCats,
    predictedEvent,
    addPurchase,
    removePurchase,
    addStaff,
    removeStaff,
    getBudgetRemaining,
  } = useTransitionStore();

  const remaining = getBudgetRemaining();
  const nextDayConfig = weekDayConfigs[Math.min(nextDay - 1, weekDayConfigs.length - 1)];
  const predictedEventCfg = predictedEvent ? businessEventConfigs[predictedEvent] : null;

  const categories: PrepCategory[] = ['catFood', 'cleaning', 'equipment', 'catTreatment'];

  const sickCats = carriedCats.filter((c) => c.isSick).length;
  const avgMood = Math.round(carriedCats.reduce((s, c) => s + c.mood, 0) / carriedCats.length);
  const avgHealth = Math.round(carriedCats.reduce((s, c) => s + c.health, 0) / carriedCats.length);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-warm-50 to-amber-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-cute text-3xl md:text-4xl text-warm-400 mb-2">
            🌙 第 {currentDay} 天结束 · 准备第 {nextDay} 天
          </h1>
          <p className="text-gray-500">{nextDayConfig.weekDayName} · {nextDayConfig.dayName}</p>
        </div>

        {previousDayStats && (
          <div className="card-cute p-4 md:p-6 mb-6">
            <h2 className="font-cute text-xl text-warm-400 mb-4">📊 昨日回顾</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-warm-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500">营收</div>
                <div className="font-bold text-lg text-warm-400">¥{previousDayStats.revenue}</div>
              </div>
              <div className="bg-matcha-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500">满意度</div>
                <div className="font-bold text-lg text-matcha-300">
                  {previousDayStats.satisfactionStart}% → {previousDayStats.satisfactionEnd}%
                </div>
              </div>
              <div className="bg-rose-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500">服务/流失</div>
                <div className="font-bold text-lg text-rose-catDark">
                  {previousDayStats.customersServed}/{previousDayStats.customersLost}
                </div>
              </div>
              <div className="bg-cocoa-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500">净利润</div>
                <div className={`font-bold text-lg ${previousDayStats.netProfit >= 0 ? 'text-matcha-300' : 'text-rose-500'}`}>
                  ¥{previousDayStats.netProfit}
                </div>
              </div>
            </div>
            {previousDayStats.keyEvents.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                <span className="text-gray-400">关键事件：</span>
                {previousDayStats.keyEvents.join(' · ')}
              </div>
            )}
          </div>
        )}

        <div className="card-cute p-4 md:p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="font-cute text-xl text-warm-400">💰 今日预算</h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                总预算：<span className="font-bold text-gray-700">¥{maxBudget}</span>
              </div>
              <div className="text-lg">
                剩余：
                <span className={`font-bold ${remaining >= 0 ? 'text-matcha-300' : 'text-rose-500'}`}>
                  ¥{remaining}
                </span>
              </div>
            </div>
          </div>

          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all ${remaining >= 0 ? 'bg-matcha-200' : 'bg-rose-400'}`}
              style={{ width: `${Math.max(0, (remaining / maxBudget) * 100)}%` }}
            />
          </div>
        </div>

        {predictedEventCfg && predictedEvent !== 'none' && (
          <div className="card-cute p-4 mb-6 border-2 border-warm-200 bg-gradient-to-r from-warm-50 to-amber-50">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{predictedEventCfg.emoji}</span>
              <div>
                <h3 className="font-cute text-lg text-warm-400">
                  明日预告：{predictedEventCfg.name}
                </h3>
                <p className="text-sm text-gray-600">{predictedEventCfg.description}</p>
              </div>
            </div>
          </div>
        )}

        <div className="card-cute p-4 md:p-6 mb-6">
          <h2 className="font-cute text-xl text-warm-400 mb-4">🐱 猫咪状态</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-warm-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500">平均心情</div>
              <div className={`font-bold text-lg ${avgMood >= 70 ? 'text-matcha-300' : avgMood >= 40 ? 'text-warm-300' : 'text-rose-500'}`}>
                {avgMood}%
              </div>
            </div>
            <div className="bg-matcha-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500">平均健康</div>
              <div className={`font-bold text-lg ${avgHealth >= 70 ? 'text-matcha-300' : avgHealth >= 40 ? 'text-warm-300' : 'text-rose-500'}`}>
                {avgHealth}%
              </div>
            </div>
            <div className="bg-rose-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500">生病数量</div>
              <div className={`font-bold text-lg ${sickCats === 0 ? 'text-matcha-300' : 'text-rose-500'}`}>
                {sickCats} 只
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {carriedCats.map((cat) => (
              <div
                key={cat.id}
                className={`px-3 py-2 rounded-xl text-sm ${
                  cat.isSick ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {cat.emoji} {cat.name} {cat.isSick && '🤒'}
              </div>
            ))}
          </div>
        </div>

        <div className="card-cute p-4 md:p-6 mb-6">
          <h2 className="font-cute text-xl text-warm-400 mb-4">🛒 物资采购</h2>
          <div className="space-y-4">
            {categories.map((cat) => {
              const label = categoryLabels[cat];
              const items = availablePurchases.filter((p) => p.category === cat);
              return (
                <div key={cat}>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm text-white bg-gradient-to-r ${label.color} mb-2`}>
                    {label.emoji} {label.name}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {items.map((item) => {
                      const isSelected = selectedPurchases.some((p) => p.id === item.id);
                      const canAfford = remaining >= item.cost || isSelected;
                      return (
                        <button
                          key={item.id}
                          onClick={() => (isSelected ? removePurchase(item.id) : addPurchase(item))}
                          disabled={!isSelected && !canAfford}
                          className={`p-3 rounded-xl text-left transition-all border-2 ${
                            isSelected
                              ? 'border-matcha-300 bg-matcha-50'
                              : canAfford
                              ? 'border-gray-100 bg-white hover:border-warm-200 hover:bg-warm-50'
                              : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-cocoa-200">
                              {item.emoji} {item.name}
                            </span>
                            <span className={`text-sm font-bold ${isSelected ? 'text-matcha-300' : 'text-warm-400'}`}>
                              ¥{item.cost}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-cute p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cute text-xl text-warm-400">👥 员工协助（最多 2 人）</h2>
            <span className="text-sm text-gray-500">已雇佣 {selectedStaff.length}/2</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {staffOptions.map((config: StaffConfig) => {
              const isHired = selectedStaff.some((s) => s.strategy === config.strategy);
              const canAfford = remaining >= config.dailyCost || isHired;
              return (
                <button
                  key={config.strategy}
                  onClick={() => (isHired ? removeStaff(selectedStaff.find((s) => s.strategy === config.strategy)!.id) : addStaff(config))}
                  disabled={!isHired && (!canAfford || selectedStaff.length >= 2)}
                  className={`p-4 rounded-xl text-left transition-all border-2 ${
                    isHired
                      ? 'border-matcha-300 bg-matcha-50'
                      : canAfford && selectedStaff.length < 2
                      ? 'border-gray-100 bg-white hover:border-warm-200 hover:bg-warm-50'
                      : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{config.emoji}</span>
                      <div>
                        <div className="font-bold text-cocoa-200">{config.name}</div>
                        <div className="text-xs text-gray-500">{staffStrategyLabels[config.strategy]}</div>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${isHired ? 'text-matcha-300' : 'text-warm-400'}`}>
                      ¥{config.dailyCost}/天
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{config.description}</p>
                  <div className="flex gap-2 text-[10px]">
                    <span className="px-2 py-0.5 bg-sky-50 text-sky-600 rounded-full">
                      效率 {Math.round(config.efficiency * 100)}%
                    </span>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-500 rounded-full">
                      失误率 {Math.round(config.errorRate * 100)}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onProceed}
            className="btn-primary text-lg py-4 px-12"
          >
            ☀️ 开始第 {nextDay} 天营业
          </button>
        </div>
      </div>
    </div>
  );
}
