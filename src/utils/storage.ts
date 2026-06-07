import type { HighScore, Difficulty } from '../game/types/game';

const HIGH_SCORES_KEY = 'cat_cafe_high_scores';

export function loadHighScores(): Record<Difficulty, HighScore | null> {
  try {
    const data = localStorage.getItem(HIGH_SCORES_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('加载最高分失败:', e);
  }
  return { easy: null, normal: null, hard: null };
}

export function saveHighScore(score: HighScore): boolean {
  const scores = loadHighScores();
  const current = scores[score.difficulty];
  
  if (!current || score.score > current.score) {
    scores[score.difficulty] = score;
    try {
      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
      return true;
    } catch (e) {
      console.error('保存最高分失败:', e);
    }
  }
  return false;
}

export function clearHighScores() {
  try {
    localStorage.removeItem(HIGH_SCORES_KEY);
  } catch (e) {
    console.error('清除最高分失败:', e);
  }
}
