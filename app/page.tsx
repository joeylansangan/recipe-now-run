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
      {/*
        The wall: mint field with a chrome trim line, like a diner wainscot.
        The search field lives INSIDE the wall — the wall is the order window,
        not decoration. Pass 1: this replaced a mint band that carried only a
        wordmark and a tagline and then ate 250px on every screen forever.
      */}
      <header className="bg-mint px-4 pb-5 pt-7">
        <div className="flex items-center gap-2.5 px-1">
          <Mark className="h-[26px] w-[26px] shrink-0 text-vinyl" />
          <h1 className="menu text-[1.4rem]">Recipe Now</h1>
        </div>

        <form
          className="pt-4"
          onSubmit={(e) => {
            e.preventDefault();
            search(query);
          }}
        >
          <div className="chrome-edge flex items-center gap-2 rounded-full bg-card p-1.5">
            <input
              /* Placeholder keeps the slab voice and the big size, but drops
                 to medium weight — at 700 it read as a value already typed. */
              className="menu min-w-0 flex-1 bg-transparent px-4 py-2 text-[1.2rem] outline-none placeholder:font-medium placeholder:text-ink-faint"
              placeholder="What are you cooking?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Dish"
            />
            <button
              /* disabled text is ink-soft, not ink-faint: WCAG exempts
                 inactive controls, but 3.19:1 is unreadable at arm's length. */
              className="label shrink-0 rounded-full bg-vinyl px-5 py-3 text-white disabled:bg-chrome disabled:text-ink-soft"
              disabled={loading || !query.trim()}
              type="submit"
            >
              {loading ? (
                /* Explicit ink: the button is disabled while loading, and the
                   inherited muted colour turned the spinner into a smudge. */
                <Spinner className="h-[17px] w-[17px] text-ink" />
              ) : (
                "Search"
              )}
            </button>
          </div>
        </form>
      </header>
      <div className="h-[6px] bg-chrome shadow-[inset_0_1px_0_#fff,inset_0_-1px_0_rgba(0,0,0,0.12)]" />

      <div className="px-4">
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
                <div className="flex items-center gap-3 py-2">
                  <Spinner className="h-7 w-7 shrink-0 text-vinyl" />
                  <p className="menu text-[1.2rem]">Getting the recipe…</p>
                </div>
              </Card>
            )}

            {recipe && (
              <article>
                <Card>
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="menu flex-1 text-[1.95rem]">{recipe.dish}</h2>
                    <button
                      /* Pass 3: unfavourited state was a hairline grey star on
                         a near-white circle — it read as disabled, on one of
                         the five core features. Now it has ink weight. */
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-xl ${
                        favorited
                          ? "border-vinyl bg-vinyl text-white"
                          : "border-ink bg-card text-ink"
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

                  {/* Pass 2: was a gap-px grid over a chrome background, which
                      bled curved slivers through the rounded clip at every
                      corner. Real borders, no clipping, no artifacts. */}
                  <dl className="mt-5 grid grid-cols-3 rounded-lg border border-chrome bg-card">
                    {[
                      // Pass 3: "10 minutes" twice against a lone "4" made the
                      // three cells read at wildly different weights.
                      ["Serves", recipe.servings.replace(/\s*servings?/i, "")],
                      ["Prep", shorten(recipe.prepTime)],
                      ["Cook", shorten(recipe.cookTime)],
                    ].map(([term, value]) => (
                      <div
                        key={term}
                        className="border-l border-chrome px-2 py-3 text-center first:border-l-0"
                      >
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
                        {/* Pass 2: was a mint rounded square with a border —
                            an unchecked checkbox, promising a tap that does
                            nothing. A list mark can't lie about that. */}
                        <span className="mt-[0.85rem] h-[3px] w-3.5 shrink-0 bg-vinyl" />
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
                    <div className="mt-3 flex items-center gap-2.5">
                      <Spinner className="h-5 w-5 shrink-0 text-vinyl" />
                      <p className="text-[1.0625rem] text-ink-soft">
                        Loading videos…
                      </p>
                    </div>
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
                        className="border-b border-chrome/70"
                      >
                        <button
                          className="flex min-h-11 w-full items-baseline justify-between gap-3 py-3 text-left"
                          onClick={() => {
                            setQuery(entry.dish);
                            search(entry.dish);
                          }}
                        >
                          <span className="menu text-[1.15rem]">
                            {entry.dish}
                          </span>
                          <span className="shrink-0 text-[0.8125rem] text-ink-faint">
                            {formatWhen(entry.at)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {/* Lives inside the card it acts on — it was floating
                      orphaned underneath before pass 1. */}
                  {/* Pass 3: was grey small-caps, identical to the timestamps
                      beside it — the one destructive control in the app read
                      as metadata. Red is the event colour; this is an event. */}
                  <button
                    className="label mt-3 min-h-11 text-vinyl"
                    onClick={() => setHistory(clearHistory())}
                  >
                    Clear history
                  </button>
                </Card>
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

/**
 * The mark: a plate seen from above — outer ring, centre well.
 * Deliberately the same shape as the installed PWA icon, so the icon on the
 * home screen and the logo in the app read as one thing.
 */
function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle
        cx="16"
        cy="16"
        r="13.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="16" cy="16" r="5" fill="currentColor" />
    </svg>
  );
}

/**
 * The same plate, with one arc sweeping the rim. Under prefers-reduced-motion
 * the spin is suppressed globally, which is why every use of this is paired
 * with words — the mark is never the only thing saying "working".
 */
function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={`animate-spin ${className}`}
    >
      <circle
        cx="16"
        cy="16"
        r="13.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.35"
      />
      <path
        d="M29.5 16A13.5 13.5 0 0 0 16 2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="5" fill="currentColor" />
    </svg>
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
  // Pass 1: was a short centred strip that read as a notice and left the
  // bottom half of the screen dead. Now it has weight and a left edge to
  // read from, and states its invitation in the menu voice.
  return (
    <div className="chrome-edge rounded-[var(--radius-card)] bg-card px-6 py-9">
      {/* Pass 2: the diamond sat ~24px above the text and read as a stray
          dot. Tied to the line it belongs to. */}
      <p className="menu text-[1.45rem] leading-tight">
        <span className="mr-2.5 inline-block h-2.5 w-2.5 rotate-45 bg-vinyl align-[0.15em]" />
        {children}
      </p>
    </div>
  );
}

/** "45 minutes" → "45 min", so the stat cells read at one glance. */
function shorten(time: string) {
  return time.replace(/\bminutes?\b/i, "min").replace(/\bhours?\b/i, "hr");
}

/** Short, human timestamps — the raw locale string carried seconds. */
function formatWhen(at: number) {
  const then = new Date(at);
  const now = new Date();
  const sameDay = then.toDateString() === now.toDateString();
  const time = then.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  if (sameDay) return `Today, ${time}`;
  return `${then.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
}
