import type { Cat } from '../types/game';

export const initialCats: Cat[] = [
  {
    id: 'cat-1',
    name: '橘子',
    emoji: '🐱',
    mood: 80,
    hunger: 70,
    health: 100,
    isSick: false,
    personality: 'friendly',
  },
  {
    id: 'cat-2',
    name: '雪球',
    emoji: '😺',
    mood: 75,
    hunger: 65,
    health: 100,
    isSick: false,
    personality: 'lazy',
  },
  {
    id: 'cat-3',
    name: '黑炭',
    emoji: '😸',
    mood: 70,
    hunger: 80,
    health: 100,
    isSick: false,
    personality: 'playful',
  },
  {
    id: 'cat-4',
    name: '花花',
    emoji: '😻',
    mood: 85,
    hunger: 60,
    health: 100,
    isSick: false,
    personality: 'shy',
  },
];

export const catNames = ['小咪', '豆豆', '毛毛', '团子', '布丁', '奶油', '芝士', '可可', '麻薯', '年糕'];
export const catEmojis = ['🐱', '😺', '😸', '😻', '🐈', '🐈‍⬛', '🙀', '😽'];

export const catPersonalityQuotes: Record<Cat['personality'], string[]> = {
  lazy: ['在晒太阳呢~', '不想动...', '让我再睡会儿', '好舒服的窝'],
  playful: ['来玩呀!', '追追追!', '这个球好有趣', '扑!'],
  shy: ['喵...?', '别看着我', '躲起来', '偷偷观察'],
  friendly: ['咕噜咕噜~', '摸摸头!', '好喜欢你', '蹭蹭你~'],
};
