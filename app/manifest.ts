import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Recipe Now",
    short_name: "Recipe Now",
    description: "Type a dish. Get the recipe and the videos.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f0e4",
    theme_color: "#bfded6",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        // A dedicated maskable file: the standard icon's sky ribbon would be
        // cropped into a smear by a platform mask, so that version drops it.
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
