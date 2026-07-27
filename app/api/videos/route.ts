import { NextResponse } from "next/server";
import type { Video } from "@/lib/types";

const SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

type YouTubeItem = {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    channelTitle?: string;
    thumbnails?: { medium?: { url?: string }; default?: { url?: string } };
  };
};

export async function GET(request: Request) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY is not set on the server." },
      { status: 500 },
    );
  }

  const dish = new URL(request.url).searchParams.get("dish")?.trim();
  if (!dish) {
    return NextResponse.json({ error: "No dish given." }, { status: 400 });
  }

  const url = new URL(SEARCH_URL);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", `${dish} recipe`);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "6");
  url.searchParams.set("key", key);

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      const detail = await response.text();
      console.error("[videos] youtube error", response.status, detail);
      return NextResponse.json(
        {
          error:
            response.status === 403
              ? "YouTube quota is used up for today."
              : "Could not load videos.",
        },
        { status: 502 },
      );
    }

    const data = (await response.json()) as { items?: YouTubeItem[] };
    const videos: Video[] = (data.items ?? [])
      .filter((item) => item.id?.videoId)
      .map((item) => ({
        id: item.id!.videoId!,
        title: item.snippet?.title ?? "Untitled",
        channel: item.snippet?.channelTitle ?? "",
        thumbnail:
          item.snippet?.thumbnails?.medium?.url ??
          item.snippet?.thumbnails?.default?.url ??
          "",
        url: `https://www.youtube.com/watch?v=${item.id!.videoId!}`,
      }));

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("[videos] failed", error);
    return NextResponse.json({ error: "Could not load videos." }, { status: 500 });
  }
}
