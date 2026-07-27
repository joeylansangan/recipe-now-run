export type Recipe = {
  dish: string;
  summary: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  ingredients: string[];
  steps: string[];
  tips: string[];
};

export type Video = {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  url: string;
};

export type Usage = {
  inputTokens: number;
  outputTokens: number;
};

export type RecipeResponse = {
  recipe: Recipe;
  usage: Usage;
};

/** One search, as stored on the device. */
export type HistoryEntry = {
  id: string;
  dish: string;
  at: number; // epoch ms
};

export type FavoriteEntry = {
  id: string;
  dish: string;
  at: number;
  recipe: Recipe;
};
