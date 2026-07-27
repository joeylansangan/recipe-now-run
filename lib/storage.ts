import type { FavoriteEntry, HistoryEntry, Recipe } from "./types";

const HISTORY_KEY = "recipe-now:history";
const FAVORITES_KEY = "recipe-now:favorites";
const HISTORY_LIMIT = 100;

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    // Corrupt or unavailable storage shouldn't take the app down.
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private mode — the app still works, it just won't remember.
  }
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getHistory(): HistoryEntry[] {
  return read<HistoryEntry>(HISTORY_KEY);
}

export function addHistory(dish: string): HistoryEntry[] {
  const entry: HistoryEntry = { id: newId(), dish, at: Date.now() };
  const next = [entry, ...getHistory()].slice(0, HISTORY_LIMIT);
  write(HISTORY_KEY, next);
  return next;
}

export function clearHistory(): HistoryEntry[] {
  write<HistoryEntry>(HISTORY_KEY, []);
  return [];
}

export function getFavorites(): FavoriteEntry[] {
  return read<FavoriteEntry>(FAVORITES_KEY);
}

export function isFavorite(dish: string): boolean {
  const key = dish.trim().toLowerCase();
  return getFavorites().some((f) => f.dish.trim().toLowerCase() === key);
}

export function addFavorite(recipe: Recipe): FavoriteEntry[] {
  const key = recipe.dish.trim().toLowerCase();
  const without = getFavorites().filter(
    (f) => f.dish.trim().toLowerCase() !== key,
  );
  const next = [
    { id: newId(), dish: recipe.dish, at: Date.now(), recipe },
    ...without,
  ];
  write(FAVORITES_KEY, next);
  return next;
}

export function removeFavorite(dish: string): FavoriteEntry[] {
  const key = dish.trim().toLowerCase();
  const next = getFavorites().filter(
    (f) => f.dish.trim().toLowerCase() !== key,
  );
  write(FAVORITES_KEY, next);
  return next;
}
