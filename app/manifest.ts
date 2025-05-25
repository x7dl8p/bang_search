import type { MetadataRoute } from "next"

// Add this line to fix the static export error
export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Universal Search - PWA Search Interface",
    short_name: "UniSearch",
    description: "A Progressive Web App search interface with DuckDuckGo bangs integration",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#18181b",
    orientation: "portrait-primary",
    categories: ["productivity", "utilities"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Quick Search",
        short_name: "Search",
        description: "Start a new search",
        url: "/?quick=true",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  }
}
