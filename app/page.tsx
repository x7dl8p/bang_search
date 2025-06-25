import { SearchInterface } from "@/components/search-interface"
import { ThemeToggle } from "@/components/theme-toggle"
import { IPLocation } from "@/components/ip-location"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Universal Search",
  description: "Search the web with bang shortcuts",
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col transition-colors">
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        <ThemeToggle />
        <IPLocation />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">Banger ;)</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Less BS to your destination.</p>
          </div>
          <SearchInterface />
        </div>
      </div>

      <footer className="text-center py-4 text-zinc-500 dark:text-zinc-500 text-sm">
        <p>Use bang shortcuts like !g for Google, !w for Wikipedia, !chatgpt for ChatGPT</p>
      </footer>
    </main>
  )
}
