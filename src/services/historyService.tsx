
import type { SummaryHistory } from "../types/history";

const STORAGE_KEY = "ai-summary-history";

// 保存済みの履歴を取得
export const getHistory = (): SummaryHistory[] => {
  const savedHistory = localStorage.getItem(STORAGE_KEY);

  if (!savedHistory) {
    return [];
  }

  try {
    return JSON.parse(savedHistory) as SummaryHistory[];
  } catch {
    return [];
  }
};

// 履歴を保存
export const saveHistory = (history: SummaryHistory[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};
