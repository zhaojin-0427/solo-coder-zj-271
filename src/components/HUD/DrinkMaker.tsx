import { useGameStore } from '../../store/gameStore';
import { drinkRecipes, temperatureOptions } from '../../game/config/drinkRecipes';
import { getMoodColor } from '../../utils/helpers';

export function DrinkMaker() {
  const {
    selectedDrinkType,
    selectedTemperature,
    selectedCustomerId,
    selectDrinkType,
    selectTemperature,
    serveDrink,
    cleanLitter,
    refillFood,
    repairMachine,
    environment,
    customers,
  } = useGameStore();

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const canServe = selectedDrinkType && selectedTemperature && selectedCustomerId && !environment.machineBroken;

  return (
    <div className="card-cute p-3 md:p-4 flex flex-col gap-3 md:gap-4">
      <div>
        <h2 className="font-cute text-lg md:text-xl text-warm-400 mb-2 md:mb-3 flex items-center gap-2">
          ☕ 饮品制作台
        </h2>

        {environment.machineBroken && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 mb-3 animate-pulse">
            <div className="text-rose-500 font-bold text-sm mb-2">⚠️ 咖啡机故障!</div>
            <button
              onClick={repairMachine}
              className="w-full btn-danger text-sm py-2.5 min-h-[40px]"
            >
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
                {drinkRecipes.find(r => r.type === selectedCustomer.order.drinkType)?.name}
                {temperatureOptions.find(t => t.type === selectedCustomer.order.temperature)?.emoji}
                {temperatureOptions.find(t => t.type === selectedCustomer.order.temperature)?.name}
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
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-cocoa-200">🚽 猫砂盆</span>
              <span className="text-xs">{Math.round(environment.litterCleanliness)}%</span>
            </div>
            <div className="flex items-center gap-2 md:gap-2">
              <div className="flex-1 progress-bar">
                <div
                  className={`progress-fill ${getMoodColor(environment.litterCleanliness)}`}
                  style={{ width: `${environment.litterCleanliness}%` }}
                />
              </div>
              <button
                onClick={cleanLitter}
                disabled={environment.litterCleanliness > 90}
                className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-matcha-200 text-white rounded-full hover:bg-matcha-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 min-h-[36px] md:min-h-[40px]"
              >
                清理
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-cocoa-200">🍽️ 猫粮储量</span>
              <span className="text-xs">{Math.round(environment.foodSupply)}%</span>
            </div>
            <div className="flex items-center gap-2 md:gap-2">
              <div className="flex-1 progress-bar">
                <div
                  className={`progress-fill ${getMoodColor(environment.foodSupply)}`}
                  style={{ width: `${environment.foodSupply}%` }}
                />
              </div>
              <button
                onClick={refillFood}
                disabled={environment.foodSupply > 90}
                className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-warm-200 text-white rounded-full hover:bg-warm-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 min-h-[36px] md:min-h-[40px]"
              >
                补充
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
