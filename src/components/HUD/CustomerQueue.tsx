import { useGameStore } from '../../store/gameStore';
import { drinkTypeMap, temperatureMap } from '../../game/config/drinkRecipes';
import { getMoodColor } from '../../utils/helpers';

export function CustomerQueue() {
  const { customers, selectedCustomerId, selectCustomer } = useGameStore();

  return (
    <div className="card-cute p-3 md:p-4 h-full flex flex-col">
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
  );
}
