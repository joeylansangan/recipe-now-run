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

const TABS: Tab[] = ["search", "history", "favorites"];

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
    <div className="mx-auto w-full max-w-[34rem]">
      {/* The wall: mint field, chrome trim line, like a diner wainscot. */}
      <header className="bg-mint px-5 pb-6 pt-9">
        <h1 className="menu text-[2.35rem]">Recipe Now</h1>
        <p className="mt-2 text-[1.0625rem] leading-snug text-ink-soft">
          Type a dish. Get the recipe and the videos.
        </p>
      </header>
      <div className="h-[6px] bg-chrome shadow-[inset_0_1px_0_#fff,inset_0_-1px_0_rgba(0,0,0,0.12)]" />

      <div className="px-4">
        <form
          className="pt-6"
          onSubmit={(e) => {
            e.preventDefault();
            search(query);
          }}
        >
          <div className="chrome-edge flex items-center gap-2 rounded-full bg-card p-1.5">
            <input
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-[1.0625rem] outline-none placeholder:text-ink-faint"
              placeholder="chicken adobo"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Dish"
            />
            <button
              className="label shrink-0 rounded-full bg-vinyl px-5 py-3 text-white disabled:bg-chrome disabled:text-ink-faint"
              disabled={loading || !query.trim()}
              type="submit"
            >
              {loading ? "…" : "Search"}
            </button>
          </div>
        </form>

        <nav className="chrome-edge mt-5 flex gap-1 rounded-full bg-card p-1.5">
          {TABS.map((name) => {
            const active = tab === name;
            const count =
              name === "history"
                ? history.length
                : name === "favorites"
                  ? favorites.length
                  : 0;
            return (
              <button
                key={name}
                className={`label flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full ${
                  active ? "bg-vinyl text-white" : "text-ink-soft"
                }`}
                onClick={() => setTab(name)}
              >
                {name}
                {count > 0 && (
                  <span className={active ? "text-white/80" : "text-ink-faint"}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <main className="px-4 pb-20 pt-5">
        {tab === "search" && (
          <>
            {error && <Notice>{error}</Notice>}

            {loading && (
              <Card>
                <p className="label text-ink-soft">Getting the recipe…</p>
              </Card>
            )}

            {recipe && (
              <article>
                <Card>
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="menu flex-1 text-[1.95rem]">{recipe.dish}</h2>
                    <button
                      className={`chrome-edge flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${
                        favorited
                          ? "bg-vinyl text-white"
                          : "bg-card text-ink-soft"
                      }`}
                      onClick={toggleFavorite}
                      aria-pressed={favorited}
                      aria-label={
                        favorited ? "Remove from favorites" : "Add to favorites"
                      }
                    >
                      {favorited ? "★" : "☆"}
                    </button>
                  </div>

                  <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">
                    {recipe.summary}
                  </p>

                  <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-chrome">
                    {[
                      ["Serves", recipe.servings.replace(/\s*servings?/i, "")],
                      ["Prep", recipe.prepTime],
                      ["Cook", recipe.cookTime],
                    ].map(([term, value]) => (
                      <div key={term} className="bg-card px-2 py-3 text-center">
                        <dt className="label text-ink-faint">{term}</dt>
                        <dd className="menu mt-1 text-[1.05rem]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>

                <Card className="mt-4">
                  <Heading>Ingredients</Heading>
                  <ul className="mt-3">
                    {recipe.ingredients.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-3 border-b border-chrome/70 py-2.5 text-[1.0625rem] leading-snug last:border-0"
                      >
                        <span className="mt-[0.45rem] h-2.5 w-2.5 shrink-0 rounded-[3px] border border-chrome-dark bg-mint" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="mt-4">
                  <Heading>Steps</Heading>
                  <ol className="mt-3">
                    {recipe.steps.map((step, i) => (
                      <li key={i} className="flex gap-3.5 py-3">
                        <span className="menu flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vinyl text-[1.05rem] text-white">
                          {i + 1}
                        </span>
                        <span className="pt-1 text-[1.0625rem] leading-relaxed">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Card>

                {recipe.tips.length > 0 && (
                  <div className="chrome-edge mt-4 rounded-[var(--radius-card)] bg-mint p-5">
                    <Heading>Tips</Heading>
                    <ul className="mt-2">
                      {recipe.tips.map((tip, i) => (
                        <li
                          key={i}
                          className="py-1 text-[1.0625rem] leading-snug"
                        >
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Card className="mt-4">
                  <Heading>Videos</Heading>
                  {videoError && (
                    <p className="mt-3 text-[1.0625rem] text-ink-soft">
                      {videoError}
                    </p>
                  )}
                  {!videoError && videos.length === 0 && (
                    <p className="label mt-3 text-ink-soft">Loading videos…</p>
                  )}
                  <ul className="mt-2">
                    {videos.map((video) => (
                      <li key={video.id}>
                        <a
                          className="flex items-start gap-3.5 border-b border-chrome/70 py-3 last:border-0"
                          href={video.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt=""
                            src={video.thumbnail}
                            className="h-[68px] w-[120px] shrink-0 rounded-lg border border-chrome-dark object-cover"
                          />
                          <span className="min-w-0">
                            <span className="block text-[0.9375rem] font-bold leading-snug">
                              {video.title}
                            </span>
                            <span className="label mt-1.5 block text-ink-faint">
                              {video.channel}
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Card>
              </article>
            )}

            {!recipe && !loading && !error && (
              <Empty>Nothing yet. Name a dish and it gets cooked.</Empty>
            )}
          </>
        )}

        {tab === "history" && (
          <>
            {history.length === 0 ? (
              <Empty>No searches yet.</Empty>
            ) : (
              <>
                <Card>
                  <ul>
                    {history.map((entry) => (
                      <li
                        key={entry.id}
                        className="border-b border-chrome/70 last:border-0"
                      >
                        <button
                          className="flex min-h-11 w-full flex-col items-start justify-center py-2.5 text-left"
                          onClick={() => {
                            setQuery(entry.dish);
                            search(entry.dish);
                          }}
                        >
                          <span className="menu text-[1.15rem]">
                            {entry.dish}
                          </span>
                          <span className="label mt-1 text-ink-faint">
                            {new Date(entry.at).toLocaleString()}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </Card>
                <button
                  className="chrome-edge label mt-4 rounded-full bg-card px-5 py-3.5 text-ink-soft"
                  onClick={() => setHistory(clearHistory())}
                >
                  Clear history
                </button>
              </>
            )}
          </>
        )}

        {tab === "favorites" && (
          <>
            {favorites.length === 0 ? (
              <Empty>No favorites yet. Star a recipe to keep it.</Empty>
            ) : (
              <Card>
                <ul>
                  {favorites.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-center gap-2 border-b border-chrome/70 last:border-0"
                    >
                      <button
                        className="flex min-h-11 flex-1 items-center gap-3 py-2.5 text-left"
                        onClick={() => openFavorite(entry)}
                      >
                        <span className="text-lg text-vinyl">★</span>
                        <span className="menu text-[1.15rem]">
                          {entry.dish}
                        </span>
                      </button>
                      <button
                        className="label min-h-11 px-2 text-ink-faint"
                        onClick={() => setFavorites(removeFavorite(entry.dish))}
                        aria-label={`Remove ${entry.dish} from favorites`}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`chrome-edge rounded-[var(--radius-card)] bg-card p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="label flex items-center gap-2 text-mint-deep">
      <span className="h-2 w-2 rotate-45 bg-vinyl" />
      {children}
    </h3>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="chrome-edge rounded-[var(--radius-card)] bg-card p-5">
      <p className="border-l-4 border-vinyl pl-3 text-[1.0625rem] leading-snug">
        {children}
      </p>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="chrome-edge rounded-[var(--radius-card)] bg-card px-5 py-8 text-center">
      <p className="text-[1.0625rem] leading-snug text-ink-soft">{children}</p>
    </div>
  );
}
