import { useEffect, useState } from 'react';
import { useDailyStore } from '../../store/dailyStore';
import { WeekTopBar } from './WeekTopBar';
import { weekDayConfigs } from '../../game/config/dayConfigs';
import { weekEventSystem } from '../../game/systems/WeekEventSystem';
import { drinkRecipes, temperatureOptions, drinkTypeMap, temperatureMap } from '../../game/config/drinkRecipes';
import { catPersonalityQuotes } from '../../game/config/catData';
import { getMoodColor, getCatOverallStatus, randomChoice } from '../../utils/helpers';
import type { CatAction } from '../../game/types/game';
import { businessEventConfigs } from '../../game/config/businessEvents';

interface WeekGameSceneProps {
  onDayEnd: () => void;
}

export function WeekGameScene({ onDayEnd }: WeekGameSceneProps) {
  const {
    timeRemaining,
    day,
    isPaused,
    cats,
    customers,
    selectedCustomerId,
    selectedDrinkType,
    selectedTemperature,
    environment,
    currentEvent,
    eventMessage,
    notifications,
    businessEvent,
    interactWithCat,
    selectDrinkType,
    selectTemperature,
    selectCustomer,
    serveDrink,
    cleanLitter,
    refillFood,
    repairMachine,
  } = useDailyStore();

  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  useEffect(() => {
    if (timeRemaining <= 0 && !isPaused) {
      weekEventSystem.stop();
      setTimeout(() => {
        onDayEnd();
      }, 800);
    }
  }, [timeRemaining, isPaused, onDayEnd]);

  const dayConfig = weekDayConfigs[Math.min(day - 1, weekDayConfigs.length - 1)];
  const eventCfg = businessEventConfigs[businessEvent];
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const canServe = selectedDrinkType && selectedTemperature && selectedCustomerId && !environment.machineBroken;

  const bgColors = {
    success: 'bg-matcha-200 border-matcha-300',
    error: 'bg-rose-400 border-rose-500',
    warning: 'bg-warm-200 border-warm-300',
    info: 'bg-blue-400 border-blue-500',
  } as const;

  return (
    <div className="min-h-screen flex flex-col">
      <WeekTopBar />

      {isPaused && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 pointer-events-auto backdrop-blur-sm">
          <div className="bg-white px-8 py-8 md:px-12 md:py-10 rounded-3xl shadow-2xl text-center max-w-sm mx-4 animate-bounce-slow">
            <div className="text-6xl md:text-7xl mb-4">⏸️</div>
            <div className="font-cute text-3xl md:text-4xl text-warm-400 mb-2">游戏暂停</div>
            <div className="text-gray-500 text-sm md:text-base">点击右上角「继续」按钮恢复游戏</div>
          </div>
        </div>
      )}

      {currentEvent && !isPaused && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-40 animate-bounce-slow">
          <div
            className={`px-8 py-4 rounded-2xl shadow-2xl text-white font-bold text-lg bg-gradient-to-r ${
              {
                catSick: 'from-rose-400 to-rose-500',
                customerComplaint: 'from-warm-200 to-warm-300',
                machineBreak: 'from-cocoa-100 to-cocoa-200',
                holiday: 'from-matcha-100 to-matcha-200',
              }[currentEvent] || 'from-warm-200 to-warm-300'
            } border-4 border-white/50`}
          >
            {eventMessage}
          </div>
        </div>
      )}

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
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          to { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>

      <div className="flex-1 p-2 md:p-4 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-4 auto-rows-min">
          <div className="lg:col-span-3 order-2 lg:order-1">
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
                      onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
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
                        {(['mood', 'hunger', 'health'] as const).map((k) => (
                          <div key={k} className="flex items-center gap-1.5 md:gap-2">
                            <span className="w-5 md:w-8 text-base md:text-base">
                              {k === 'mood' ? '😊' : k === 'hunger' ? '🍽️' : '❤️'}
                            </span>
                            <div className="flex-1 progress-bar">
                              <div className={`progress-fill ${getMoodColor(cat[k])}`} style={{ width: `${cat[k]}%` }} />
                            </div>
                            <span className="w-6 md:w-8 text-right text-[10px] md:text-xs">{Math.round(cat[k])}</span>
                          </div>
                        ))}
                      </div>
                      {isExpanded && (
                        <div className="mt-2 md:mt-3 pt-2 border-t border-warm-100" onClick={(e) => e.stopPropagation()}>
                          <div className="text-[10px] md:text-xs text-gray-500 mb-2 italic">
                            "{randomChoice(catPersonalityQuotes[cat.personality])}"
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                            {(['pet', 'feed', 'play'] as CatAction[]).map((a) => (
                              <button
                                key={a}
                                onClick={(e) => { e.stopPropagation(); interactWithCat(cat.id, a); }}
                                disabled={a === 'feed' && environment.foodSupply < 10}
                                className={`${
                                  a === 'pet' ? 'bg-rose-cat hover:bg-rose-catDark'
                                  : a === 'feed' ? 'bg-warm-200 hover:bg-warm-300 disabled:bg-gray-300 disabled:cursor-not-allowed'
                                  : 'bg-matcha-200 hover:bg-matcha-300'
                                } text-white text-[11px] md:text-xs py-2 md:py-1.5 px-2 md:px-2 rounded-full transition-all active:scale-95 min-h-[36px]`}
                              >
                                {a === 'pet' ? '🤚 摸摸' : a === 'feed' ? '🍽️ 喂食' : '🎾 玩耍'}
                              </button>
                            ))}
                            {(cat.isSick || cat.health < 80) && (
                              <button
                                onClick={(e) => { e.stopPropagation(); interactWithCat(cat.id, 'heal'); }}
                                className="bg-cocoa-100 hover:bg-cocoa-200 text-white text-[11px] md:text-xs py-2 md:py-1.5 px-2 md:px-2 rounded-full transition-all active:scale-95 min-h-[36px] animate-pulse col-span-2"
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
          </div>

          <div className="lg:col-span-5 flex flex-col gap-2 md:gap-4 order-1 lg:order-2">
            <div className="card-cute p-3 md:p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-cute text-lg md:text-xl text-warm-400">🎯 Day {day} 目标</h2>
                <div className="flex items-center gap-2">
                  {businessEvent !== 'none' && (
                    <span className="text-xs px-2 py-1 bg-warm-50 rounded-full">
                      {eventCfg.emoji} {eventCfg.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{dayConfig.weekDayName} · {dayConfig.dayName}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-4 text-sm">
                <div className="bg-warm-50 rounded-xl p-2 md:p-3">
                  <div className="text-xs text-gray-500">满意度目标</div>
                  <div className="font-bold text-warm-400 text-base md:text-lg">≥ {dayConfig.targetSatisfaction}%</div>
                </div>
                <div className="bg-matcha-50 rounded-xl p-2 md:p-3">
                  <div className="text-xs text-gray-500">营收目标</div>
                  <div className="font-bold text-matcha-300 text-base md:text-lg">≥ ¥{dayConfig.targetRevenue}</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic text-center">{dayConfig.description}</p>
            </div>

            <div className="card-cute p-3 md:p-4 h-full flex flex-col min-h-[280px] md:min-h-0">
              <h2 className="font-cute text-lg md:text-xl text-warm-400 mb-2 md:mb-3 flex items-center gap-2">
                👥 等待的顾客 ({customers.length}/6)
              </h2>
              {customers.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm py-8 md:py-4">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl mb-2 opacity-50">☕</div>
                    <div className="text-xs md:text-sm">暂无顾客，休息一下吧~</div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 md:pr-1 max-h-[400px] md:max-h-none">
                  {customers.map((customer, index) => {
                    const patiencePct = (customer.patience / customer.maxPatience) * 100;
                    const isSelected = selectedCustomerId === customer.id;
                    const drinkInfo = drinkTypeMap[customer.order.drinkType];
                    const tempInfo = temperatureMap[customer.order.temperature];
                    return (
                      <div
                        key={customer.id}
                        onClick={() => selectCustomer(isSelected ? null : customer.id)}
                        className={`relative rounded-xl p-2.5 md:p-3 cursor-pointer transition-all duration-200 border-2 md:border-3 min-h-[72px] md:min-h-[80px] ${
                          isSelected
                            ? 'border-warm-200 bg-warm-50 shadow-lg scale-[1.01] md:scale-[1.02]'
                            : 'border-transparent bg-white hover:border-warm-100 hover:bg-warm-50/50 active:scale-[0.99]'
                        }`}
                      >
                        <div className="absolute -top-2 -left-2 w-5 h-5 md:w-6 md:h-6 bg-warm-200 text-white text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center shadow">
                          {index + 1}
                        </div>
                        <div className="flex items-start gap-2 md:gap-3">
                          <div className="text-3xl md:text-4xl flex-shrink-0">{customer.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-cocoa-200 text-sm md:text-sm">{customer.name}</span>
                              <span className="text-xs md:text-xs text-matcha-300 font-bold">¥{customer.order.reward}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] md:text-xs bg-gray-50 rounded-full px-1.5 md:px-2 py-1 mb-1.5 inline-flex">
                              <span>{drinkInfo.emoji}</span>
                              <span className="text-gray-700 truncate">{drinkInfo.name}</span>
                              <span className="text-gray-400">·</span>
                              <span>{tempInfo.emoji}</span>
                              <span className="text-gray-700">{tempInfo.name}</span>
                            </div>
                            {customer.wantsPhoto && (
                              <div className="text-[10px] md:text-xs text-rose-catDark mb-1.5 flex items-center gap-1">
                                📸 想和猫咪合影!
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 md:gap-2">
                              <span className="text-[10px] md:text-xs">⏳</span>
                              <div className="flex-1 progress-bar h-2">
                                <div
                                  className={`progress-fill ${patiencePct > 60 ? 'bg-matcha-200' : patiencePct > 30 ? 'bg-warm-200' : 'bg-rose-400 animate-pulse'}`}
                                  style={{ width: `${patiencePct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 order-3">
            <div className="card-cute p-3 md:p-4 flex flex-col gap-3 md:gap-4">
              <div>
                <h2 className="font-cute text-lg md:text-xl text-warm-400 mb-2 md:mb-3 flex items-center gap-2">
                  ☕ 饮品制作台
                </h2>
                {environment.machineBroken && (
                  <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 mb-3 animate-pulse">
                    <div className="text-rose-500 font-bold text-sm mb-2">⚠️ 咖啡机故障!</div>
                    <button onClick={repairMachine} className="w-full btn-danger text-sm py-2.5 min-h-[40px]">
                      🔧 立即修理
                    </button>
                  </div>
                )}
                <div className="mb-3 md:mb-3">
                  <div className="text-sm font-bold text-cocoa-200 mb-2">选择饮品</div>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                    {drinkRecipes.map((recipe) => (
                      <button
                        key={recipe.type}
                        onClick={() => selectDrinkType(selectedDrinkType === recipe.type ? null : recipe.type)}
                        disabled={environment.machineBroken}
                        className={`p-2.5 md:p-3 rounded-xl text-sm transition-all border-2 min-h-[72px] md:min-h-[80px] ${
                          selectedDrinkType === recipe.type
                            ? 'bg-warm-200 text-white border-warm-300 scale-[1.03] shadow-md'
                            : 'bg-white text-cocoa-200 border-warm-100 hover:border-warm-200 hover:bg-warm-50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'
                        }`}
                      >
                        <div className="text-2xl md:text-2xl mb-0.5">{recipe.emoji}</div>
                        <div className="font-bold text-xs md:text-sm">{recipe.name}</div>
                        <div className="text-[10px] md:text-xs opacity-70">¥{recipe.basePrice}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3 md:mb-3">
                  <div className="text-sm font-bold text-cocoa-200 mb-2">选择温度</div>
                  <div className="grid grid-cols-3 gap-2">
                    {temperatureOptions.map((opt) => (
                      <button
                        key={opt.type}
                        onClick={() => selectTemperature(selectedTemperature === opt.type ? null : opt.type)}
                        disabled={environment.machineBroken}
                        className={`p-2.5 md:p-3 rounded-xl text-sm transition-all border-2 min-h-[60px] md:min-h-[68px] ${
                          selectedTemperature === opt.type
                            ? 'bg-matcha-200 text-white border-matcha-300 scale-[1.03] shadow-md'
                            : 'bg-white text-cocoa-200 border-warm-100 hover:border-matcha-100 hover:bg-matcha-50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'
                        }`}
                      >
                        <div className="text-xl md:text-xl mb-0.5">{opt.emoji}</div>
                        <div className="font-bold text-xs md:text-sm">{opt.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {selectedCustomer && (
                  <div className="bg-warm-50 rounded-xl p-2.5 md:p-3 mb-3 border-2 border-warm-100">
                    <div className="text-xs text-gray-500 mb-1">当前顾客订单:</div>
                    <div className="text-sm font-bold text-cocoa-200">
                      {selectedCustomer.emoji} {selectedCustomer.name} 想要:
                      <span className="text-warm-400 ml-1">
                        {drinkRecipes.find((r) => r.type === selectedCustomer.order.drinkType)?.name}
                        {temperatureOptions.find((t) => t.type === selectedCustomer.order.temperature)?.emoji}
                        {temperatureOptions.find((t) => t.type === selectedCustomer.order.temperature)?.name}
                      </span>
                    </div>
                  </div>
                )}
                <button
                  onClick={serveDrink}
                  disabled={!canServe}
                  className={`w-full py-3 md:py-3.5 rounded-2xl font-bold text-white text-base md:text-lg transition-all min-h-[48px] ${
                    canServe
                      ? 'bg-gradient-to-r from-warm-200 to-warm-300 hover:shadow-xl hover:scale-[1.01] active:scale-95'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  ✨ 送出饮品
                </button>
              </div>

              <div className="border-t-2 border-warm-100 pt-3 md:pt-4">
                <h3 className="font-cute text-base md:text-lg text-warm-400 mb-2 md:mb-3">🧹 环境维护</h3>
                <div className="space-y-2.5 md:space-y-3">
                  {[
                    { key: 'litterCleanliness' as const, label: '🧹 猫砂清洁度', action: cleanLitter, disabled: environment.litterCleanliness > 90 },
                    { key: 'foodSupply' as const, label: '🍽️ 猫粮储量', action: refillFood, disabled: environment.foodSupply > 90 },
                    { key: 'hygiene' as const, label: '✨ 店铺卫生', action: cleanLitter, disabled: (environment.hygiene ?? 0) > 90 },
                    { key: 'machineDurability' as const, label: '🔧 设备耐久', action: repairMachine, disabled: (environment.machineDurability ?? 0) > 90 },
                  ].map((item) => {
                    const value = item.key === 'litterCleanliness' || item.key === 'foodSupply'
                      ? environment[item.key]
                      : (environment[item.key] ?? 0);
                    return (
                    <div key={item.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-cocoa-200">{item.label}</span>
                        <span className="text-xs">{Math.round(value)}%</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-2">
                        <div className="flex-1 progress-bar">
                          <div
                            className={`progress-fill ${getMoodColor(value)}`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <button
                          onClick={item.action}
                          disabled={item.disabled}
                          className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-matcha-200 text-white rounded-full hover:bg-matcha-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 min-h-[36px] md:min-h-[40px]"
                        >
                          维护
                        </button>
                      </div>
                    </div>
                  );})}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
