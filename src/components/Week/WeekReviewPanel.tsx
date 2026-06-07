import { useWeekStore } from '../../store/weekStore';
import { businessEventConfigs } from '../../game/config/businessEvents';
import { weekDifficultyLabels } from '../../game/config/dayConfigs';
import type { DailyStats } from '../../game/types/game';

interface WeekReviewPanelProps {
  onBackToMenu: () => void;
  isNewBest?: boolean;
  finalScore: number;
}

export function WeekReviewPanel({ onBackToMenu, isNewBest, finalScore }: WeekReviewPanelProps) {
  const {
    name,
    difficulty,
    cumulativeRevenue,
    cumulativeProfit,
    avgSatisfaction,
    totalComplaints,
    history,
    bestDay,
    worstDay,
    saveArchive,
  } = useWeekStore();

  const totalServed = history.reduce((s, d) => s + d.customersServed, 0);
  const totalLost = history.reduce((s, d) => s + d.customersLost, 0);
  const totalTimeout = history.reduce((s, d) => s + d.lostReasons.timeout, 0);
  const totalWrongDrink = history.reduce((s, d) => s + d.lostReasons.wrongDrink, 0);

  const maxRevenue = Math.max(...history.map((d) => d.revenue), 1);
  const maxSat = 100;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-warm-50 to-amber-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          {isNewBest && (
            <div className="inline-block mb-3 px-4 py-2 bg-gradient-to-r from-amber-300 to-amber-400 text-white rounded-full font-bold animate-pulse">
              🏆 新的最佳经营周！
            </div>
          )}
          <h1 className="font-cute text-3xl md:text-5xl text-warm-400 mb-2">
            🎉 七日经营挑战完成！
          </h1>
          <p className="text-gray-500">{name} · {weekDifficultyLabels[difficulty]}</p>
          <div className="mt-4 text-5xl font-cute text-matcha-300">
            {finalScore} <span className="text-2xl text-gray-400">分</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="card-cute p-4 text-center">
            <div className="text-3xl mb-1">💰</div>
            <div className="text-xs text-gray-500">累计营收</div>
            <div className="font-cute text-2xl text-warm-400">¥{cumulativeRevenue}</div>
          </div>
          <div className="card-cute p-4 text-center">
            <div className="text-3xl mb-1">📈</div>
            <div className="text-xs text-gray-500">累计利润</div>
            <div className={`font-cute text-2xl ${cumulativeProfit >= 0 ? 'text-matcha-300' : 'text-rose-500'}`}>
              ¥{cumulativeProfit}
            </div>
          </div>
          <div className="card-cute p-4 text-center">
            <div className="text-3xl mb-1">😊</div>
            <div className="text-xs text-gray-500">平均满意度</div>
            <div className="font-cute text-2xl text-matcha-300">{avgSatisfaction}%</div>
          </div>
          <div className="card-cute p-4 text-center">
            <div className="text-3xl mb-1">👥</div>
            <div className="text-xs text-gray-500">总服务/流失</div>
            <div className="font-cute text-2xl text-cocoa-100">
              {totalServed}<span className="text-rose-500 text-lg">/{totalLost}</span>
            </div>
          </div>
        </div>

        {bestDay !== null && worstDay !== null && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="card-cute p-5 bg-gradient-to-br from-matcha-50 to-emerald-50">
              <div className="text-sm text-matcha-400 mb-1">✨ 最佳表现日</div>
              <div className="font-cute text-2xl text-matcha-300">第 {bestDay} 天</div>
              {history[bestDay - 1] && (
                <div className="text-sm text-gray-500 mt-1">
                  营收 ¥{history[bestDay - 1].revenue} · 利润 ¥{history[bestDay - 1].netProfit}
                </div>
              )}
            </div>
            <div className="card-cute p-5 bg-gradient-to-br from-rose-50 to-orange-50">
              <div className="text-sm text-rose-400 mb-1">⚠️ 需改进日</div>
              <div className="font-cute text-2xl text-rose-500">第 {worstDay} 天</div>
              {history[worstDay - 1] && (
                <div className="text-sm text-gray-500 mt-1">
                  营收 ¥{history[worstDay - 1].revenue} · 利润 ¥{history[worstDay - 1].netProfit}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="card-cute p-5 mb-8">
          <h2 className="font-cute text-xl text-warm-400 mb-4">📊 按天数据</h2>

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">💰 每日营收</div>
            <div className="flex items-end gap-2 h-40">
              {history.map((day) => {
                const height = (day.revenue / maxRevenue) * 100;
                const isBest = day.day === bestDay;
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="text-xs font-bold text-cocoa-100 mb-1">{day.revenue}</div>
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        isBest ? 'bg-gradient-to-t from-matcha-300 to-matcha-200' : 'bg-gradient-to-t from-warm-300 to-warm-200'
                      }`}
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <div className="text-xs text-gray-500 mt-1">D{day.day}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">😊 满意度变化</div>
            <div className="relative h-40">
              <svg className="w-full h-full" viewBox={`0 0 ${history.length * 80} 140`} preserveAspectRatio="none">
                {[0, 25, 50, 75, 100].map((v) => (
                  <line
                    key={v}
                    x1="0"
                    y1={140 - (v / maxSat) * 130 - 5}
                    x2={history.length * 80}
                    y2={140 - (v / maxSat) * 130 - 5}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}
                <polyline
                  fill="none"
                  stroke="#f4a261"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={history
                    .map(
                      (d, i) =>
                        `${i * 80 + 40},${140 - (d.satisfactionEnd / maxSat) * 130 - 5}`
                    )
                    .join(' ')}
                />
                {history.map((d, i) => (
                  <circle
                    key={d.day}
                    cx={i * 80 + 40}
                    cy={140 - (d.satisfactionEnd / maxSat) * 130 - 5}
                    r="6"
                    fill="#f4a261"
                    stroke="white"
                    strokeWidth="2"
                  />
                ))}
              </svg>
              <div className="flex justify-between mt-1 px-4">
                {history.map((d) => (
                  <div key={d.day} className="text-xs text-gray-500">
                    D{d.day} · {d.satisfactionEnd}%
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-2">🐱 猫咪状态曲线（心情/健康/饥饿）</div>
            <div className="relative h-32">
              <svg className="w-full h-full" viewBox={`0 0 ${history.length * 80} 110`} preserveAspectRatio="none">
                {[0, 50, 100].map((v) => (
                  <line
                    key={v}
                    x1="0"
                    y1={110 - (v / 100) * 100 - 5}
                    x2={history.length * 80}
                    y2={110 - (v / 100) * 100 - 5}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}
                <polyline
                  fill="none"
                  stroke="#86efac"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={history
                    .map((d, i) => `${i * 80 + 40},${110 - (d.catAvgMood / 100) * 100 - 5}`)
                    .join(' ')}
                />
                <polyline
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={history
                    .map((d, i) => `${i * 80 + 40},${110 - (d.catAvgHealth / 100) * 100 - 5}`)
                    .join(' ')}
                />
                <polyline
                  fill="none"
                  stroke="#fb7185"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={history
                    .map((d, i) => `${i * 80 + 40},${110 - (d.catAvgHunger / 100) * 100 - 5}`)
                    .join(' ')}
                />
              </svg>
              <div className="flex gap-4 justify-center text-xs mt-1">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-matcha-200"></span>心情
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-amber-300"></span>健康
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-rose-300"></span>饱食
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="card-cute p-5">
            <h3 className="font-cute text-lg text-warm-400 mb-3">🚪 顾客流失原因</h3>
            {totalLost === 0 ? (
              <p className="text-gray-500 text-sm">没有顾客流失，太棒了！</p>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">⏰</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>等待超时</span>
                      <span className="font-bold">{totalTimeout} 人 ({Math.round((totalTimeout / totalLost) * 100)}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-300 to-orange-400"
                        style={{ width: `${(totalTimeout / totalLost) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">❌</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>饮品错误</span>
                      <span className="font-bold">{totalWrongDrink} 人 ({Math.round((totalWrongDrink / totalLost) * 100)}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-300 to-rose-400"
                        style={{ width: `${(totalWrongDrink / totalLost) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card-cute p-5">
            <h3 className="font-cute text-lg text-warm-400 mb-3">📝 每日关键事件</h3>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {history.map((day: DailyStats) => (
                <div key={day.day} className="flex items-start gap-2 text-sm">
                  <span className="text-warm-400 font-bold flex-shrink-0">D{day.day}</span>
                  <div className="flex-1">
                    {day.event !== 'none' && (
                      <span className="mr-1">{businessEventConfigs[day.event].emoji}</span>
                    )}
                    {day.keyEvents.length > 0 ? (
                      <span className="text-gray-600">{day.keyEvents.join('，')}</span>
                    ) : (
                      <span className="text-gray-400">平稳运营</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-cute p-5 mb-8">
          <h3 className="font-cute text-lg text-warm-400 mb-3">📋 每日详情</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-100 text-gray-500 text-xs">
                  <th className="py-2 px-2 text-left">天数</th>
                  <th className="py-2 px-2 text-left">事件</th>
                  <th className="py-2 px-2 text-right">营收</th>
                  <th className="py-2 px-2 text-right">满意</th>
                  <th className="py-2 px-2 text-right">服务</th>
                  <th className="py-2 px-2 text-right">流失</th>
                  <th className="py-2 px-2 text-right">投诉</th>
                  <th className="py-2 px-2 text-right">净利</th>
                </tr>
              </thead>
              <tbody>
                {history.map((day: DailyStats) => (
                  <tr key={day.day} className="border-b border-gray-50">
                    <td className="py-2 px-2 font-bold text-warm-400">D{day.day}</td>
                    <td className="py-2 px-2">
                      {day.event !== 'none' ? (
                        <span title={businessEventConfigs[day.event].name}>
                          {businessEventConfigs[day.event].emoji}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-right text-warm-400 font-bold">¥{day.revenue}</td>
                    <td className="py-2 px-2 text-right">{day.satisfactionEnd}%</td>
                    <td className="py-2 px-2 text-right">{day.customersServed}</td>
                    <td className="py-2 px-2 text-right text-rose-500">{day.customersLost}</td>
                    <td className="py-2 px-2 text-right text-rose-400">{day.complaints}</td>
                    <td
                      className={`py-2 px-2 text-right font-bold ${
                        day.netProfit >= 0 ? 'text-matcha-300' : 'text-rose-500'
                      }`}
                    >
                      ¥{day.netProfit}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-warm-200 font-bold">
                  <td className="py-2 px-2 text-warm-400">合计</td>
                  <td className="py-2 px-2"></td>
                  <td className="py-2 px-2 text-right text-warm-400">¥{cumulativeRevenue}</td>
                  <td className="py-2 px-2 text-right">{avgSatisfaction}%</td>
                  <td className="py-2 px-2 text-right">{totalServed}</td>
                  <td className="py-2 px-2 text-right text-rose-500">{totalLost}</td>
                  <td className="py-2 px-2 text-right text-rose-400">{totalComplaints}</td>
                  <td
                    className={`py-2 px-2 text-right ${
                      cumulativeProfit >= 0 ? 'text-matcha-300' : 'text-rose-500'
                    }`}
                  >
                    ¥{cumulativeProfit}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              saveArchive();
              onBackToMenu();
            }}
            className="btn-primary text-lg py-3 flex-1 md:flex-none min-w-[200px]"
          >
            💾 保存并返回菜单
          </button>
          <button onClick={onBackToMenu} className="btn-secondary text-lg py-3 flex-1 md:flex-none min-w-[200px]">
            🏠 返回菜单
          </button>
        </div>
      </div>
    </div>
  );
}
