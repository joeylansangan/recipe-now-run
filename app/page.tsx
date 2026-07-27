"use client";

import { useEffect, useState } from "react";
import type {
  FavoriteEntry,
  HistoryEntry,
  Recipe,
  RecipeResponse,
  Video,
} from "@/lib/types";
import {
  addFavorite,
  addHistory,
  clearHistory,
  getFavorites,
  getHistory,
  isFavorite,
  removeFavorite,
} from "@/lib/storage";

type Tab = "search" | "history" | "favorites";

export default function Home() {
  const [tab, setTab] = useState<Tab>("search");
  const [query, setQuery] = useState("");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);

  // localStorage only exists in the browser, so load after mount.
  useEffect(() => {
    setHistory(getHistory());
    setFavorites(getFavorites());
  }, []);

  async function loadVideos(dish: string) {
    try {
      const response = await fetch(
        `/api/videos?dish=${encodeURIComponent(dish)}`,
      );
      const data = (await response.json()) as {
        videos?: Video[];
        error?: string;
      };
      if (!response.ok) {
        setVideoError(data.error ?? "Could not load videos.");
        return;
      }
      setVideos(data.videos ?? []);
    } catch {
      setVideoError("Could not load videos.");
    }
  }

  async function search(dish: string) {
    const term = dish.trim();
    if (!term || loading) return;

    setLoading(true);
    setError(null);
    setVideoError(null);
    setRecipe(null);
    setVideos([]);
    setTab("search");

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dish: term }),
      });
      const data = (await response.json()) as RecipeResponse & {
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setRecipe(data.recipe);
      setFavorited(isFavorite(data.recipe.dish));
      setHistory(addHistory(data.recipe.dish));
      loadVideos(term);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  function toggleFavorite() {
    if (!recipe) return;
    if (favorited) {
      setFavorites(removeFavorite(recipe.dish));
      setFavorited(false);
    } else {
      setFavorites(addFavorite(recipe));
      setFavorited(true);
    }
  }

  function openFavorite(entry: FavoriteEntry) {
    setRecipe(entry.recipe);
    setFavorited(true);
    setQuery(entry.dish);
    setError(null);
    setVideos([]);
    setVideoError(null);
    setTab("search");
    loadVideos(entry.dish);
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-4">
      <h1 className="text-2xl font-bold">Recipe Now</h1>
      <p className="text-sm text-gray-600">
        Type a dish. Get the recipe and the videos.
      </p>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          search(query);
        }}
      >
        <input
          className="flex-1 rounded border border-gray-400 px-3 py-2"
          placeholder="chicken adobo"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={loading || !query.trim()}
          type="submit"
        >
          {loading ? "…" : "Search"}
        </button>
      </form>

      <nav className="mt-4 flex gap-2 border-b border-gray-300 pb-2">
        {(["search", "history", "favorites"] as Tab[]).map((name) => (
          <button
            key={name}
            className={`rounded px-3 py-1 text-sm capitalize ${
              tab === name ? "bg-gray-200 font-semibold" : ""
            }`}
            onClick={() => setTab(name)}
          >
            {name}
            {name === "history" && history.length > 0 && ` (${history.length})`}
            {name === "favorites" &&
              favorites.length > 0 &&
              ` (${favorites.length})`}
          </button>
        ))}
      </nav>

      {tab === "search" && (
        <section className="mt-4">
          {error && <p className="text-red-700">{error}</p>}
          {loading && <p>Getting the recipe…</p>}

          {recipe && (
            <article>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold">{recipe.dish}</h2>
                <button
                  className="shrink-0 rounded border border-gray-400 px-3 py-1 text-sm"
                  onClick={toggleFavorite}
                >
                  {favorited ? "★ Favorited" : "☆ Favorite"}
                </button>
              </div>
              <p className="mt-1 text-gray-700">{recipe.summary}</p>
              <p className="mt-2 text-sm text-gray-600">
                {recipe.servings} · prep {recipe.prepTime} · cook{" "}
                {recipe.cookTime}
              </p>

              <h3 className="mt-4 font-semibold">Ingredients</h3>
              <ul className="list-disc pl-5">
                {recipe.ingredients.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h3 className="mt-4 font-semibold">Steps</h3>
              <ol className="list-decimal space-y-1 pl-5">
                {recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>

              {recipe.tips.length > 0 && (
                <>
                  <h3 className="mt-4 font-semibold">Tips</h3>
                  <ul className="list-disc pl-5">
                    {recipe.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </>
              )}

              <h3 className="mt-6 font-semibold">Videos</h3>
              {videoError && (
                <p className="text-sm text-red-700">{videoError}</p>
              )}
              {!videoError && videos.length === 0 && (
                <p className="text-sm text-gray-600">Loading videos…</p>
              )}
              <ul className="mt-2 space-y-2">
                {videos.map((video) => (
                  <li key={video.id}>
                    <a
                      className="flex gap-3"
                      href={video.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt=""
                        src={video.thumbnail}
                        className="h-[68px] w-[120px] shrink-0 rounded object-cover"
                      />
                      <span>
                        <span className="block text-sm font-medium">
                          {video.title}
                        </span>
                        <span className="block text-xs text-gray-600">
                          {video.channel}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          )}

          {!recipe && !loading && !error && (
            <p className="text-gray-600">Nothing yet — search a dish above.</p>
          )}
        </section>
      )}

      {tab === "history" && (
        <section className="mt-4">
          {history.length === 0 ? (
            <p className="text-gray-600">No searches yet.</p>
          ) : (
            <>
              <button
                className="mb-2 text-sm underline"
                onClick={() => setHistory(clearHistory())}
              >
                Clear history
              </button>
              <ul className="space-y-1">
                {history.map((entry) => (
                  <li key={entry.id}>
                    <button
                      className="text-left"
                      onClick={() => {
                        setQuery(entry.dish);
                        search(entry.dish);
                      }}
                    >
                      <span className="font-medium">{entry.dish}</span>{" "}
                      <span className="text-xs text-gray-600">
                        {new Date(entry.at).toLocaleString()}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {tab === "favorites" && (
        <section className="mt-4">
          {favorites.length === 0 ? (
            <p className="text-gray-600">No favorites yet.</p>
          ) : (
            <ul className="space-y-1">
              {favorites.map((entry) => (
                <li key={entry.id} className="flex items-center gap-2">
                  <button
                    className="text-left font-medium"
                    onClick={() => openFavorite(entry)}
                  >
                    {entry.dish}
                  </button>
                  <button
                    className="text-xs underline"
                    onClick={() => setFavorites(removeFavorite(entry.dish))}
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
