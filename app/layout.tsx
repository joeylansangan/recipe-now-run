import type { Metadata, Viewport } from "next";
import { Karla, Zilla_Slab } from "next/font/google";
import "./globals.css";

// Zilla Slab — SIL Open Font License 1.1 (Typotheque / Mozilla).
const zilla = Zilla_Slab({
  variable: "--font-zilla",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Karla — SIL Open Font License 1.1 (Jonathan Pinhorn).
const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipe Now",
  description: "Type a dish. Get the recipe and the videos.",
  appleWebApp: { capable: true, title: "Recipe Now", statusBarStyle: "default" },
  icons: { apple: "/apple-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#bfded6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${zilla.variable} ${karla.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
