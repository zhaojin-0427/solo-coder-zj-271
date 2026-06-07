import type { HighScore, Difficulty, WeeklyArchive, BestWeekRecord } from '../game/types/game';

const HIGH_SCORES_KEY = 'cat_cafe_high_scores';
const WEEKLY_ARCHIVES_KEY = 'cat_cafe_weekly_archives';
const BEST_WEEK_KEY = 'cat_cafe_best_week';

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

export function loadWeeklyArchives(): WeeklyArchive[] {
  try {
    const data = localStorage.getItem(WEEKLY_ARCHIVES_KEY);
    if (data) {
      const result = JSON.parse(data);
      return Array.isArray(result) ? result : [];
    }
  } catch (e) {
    console.error('加载周存档失败:', e);
  }
  return [];
}

export function saveWeeklyArchive(archive: WeeklyArchive): boolean {
  try {
    const archives = loadWeeklyArchives();
    const existingIndex = archives.findIndex((a) => a.id === archive.id);
    if (existingIndex >= 0) {
      archives[existingIndex] = archive;
    } else {
      archives.unshift(archive);
    }
    const trimmed = archives.slice(0, 20);
    localStorage.setItem(WEEKLY_ARCHIVES_KEY, JSON.stringify(trimmed));
    return true;
  } catch (e) {
    console.error('保存周存档失败:', e);
    return false;
  }
}

export function removeWeeklyArchive(id: string): boolean {
  try {
    const archives = loadWeeklyArchives();
    const filtered = archives.filter((a) => a.id !== id);
    localStorage.setItem(WEEKLY_ARCHIVES_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('删除周存档失败:', e);
    return false;
  }
}

export function clearWeeklyArchives() {
  try {
    localStorage.removeItem(WEEKLY_ARCHIVES_KEY);
  } catch (e) {
    console.error('清除周存档失败:', e);
  }
}

export function loadBestWeek(): BestWeekRecord | null {
  try {
    const data = localStorage.getItem(BEST_WEEK_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('加载最佳周记录失败:', e);
  }
  return null;
}

export function saveBestWeek(record: BestWeekRecord): boolean {
  try {
    localStorage.setItem(BEST_WEEK_KEY, JSON.stringify(record));
    return true;
  } catch (e) {
    console.error('保存最佳周记录失败:', e);
    return false;
  }
}

export function clearBestWeek() {
  try {
    localStorage.removeItem(BEST_WEEK_KEY);
  } catch (e) {
    console.error('清除最佳周记录失败:', e);
  }
}
