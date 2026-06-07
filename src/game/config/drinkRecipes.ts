import type { DrinkRecipe, TemperatureOption, DrinkType, Temperature } from '../types/game';

export const drinkRecipes: DrinkRecipe[] = [
  {
    type: 'coffee',
    name: '美式咖啡',
    emoji: '☕',
    basePrice: 18,
    description: '经典醇香的美式咖啡',
  },
  {
    type: 'cappuccino',
    name: '卡布奇诺',
    emoji: '🥛',
    basePrice: 25,
    description: '丝滑奶泡配上意式浓缩',
  },
  {
    type: 'matcha',
    name: '抹茶拿铁',
    emoji: '🍵',
    basePrice: 22,
    description: '来自宇治的抹茶风味',
  },
  {
    type: 'milkTea',
    name: '珍珠奶茶',
    emoji: '🧋',
    basePrice: 20,
    description: 'Q弹珍珠配上香浓奶茶',
  },
];

export const temperatureOptions: TemperatureOption[] = [
  { type: 'hot', name: '热饮', emoji: '🔥' },
  { type: 'warm', name: '温饮', emoji: '🌡️' },
  { type: 'ice', name: '冰饮', emoji: '🧊' },
];

export const drinkTypeMap: Record<DrinkType, DrinkRecipe> = drinkRecipes.reduce(
  (acc, recipe) => ({ ...acc, [recipe.type]: recipe }),
  {} as Record<DrinkType, DrinkRecipe>
);

export const temperatureMap: Record<Temperature, TemperatureOption> = temperatureOptions.reduce(
  (acc, opt) => ({ ...acc, [opt.type]: opt }),
  {} as Record<Temperature, TemperatureOption>
);
