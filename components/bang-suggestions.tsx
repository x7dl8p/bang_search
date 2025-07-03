"use client"

import { Zap } from "lucide-react"
import type { BangData } from "@/types/bang"

interface BangSuggestionsProps {
  bangs: BangData[]
  onSelect: (bang: string) => void
  query: string
}

export function BangSuggestions({ bangs, onSelect, query }: BangSuggestionsProps) {
  return (
    <div className="p-3 h-full">
      <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
        <Zap className="w-3 h-3" />
        Bang Shortcuts
        <span className="text-zinc-400 dark:text-zinc-500">({bangs.length} found)</span>
      </div>

      <div className="overflow-y-auto h-full">
        <div className="flex flex-wrap gap-2 m-1">
          {bangs.map((bang) => (
            <button
              key={bang.trigger}
              onClick={() => onSelect(`!${bang.trigger}`)}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 cursor-pointer transition-colors duration-200 whitespace-nowrap dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              title={`${bang.name} - ${bang.category} - ${bang.domain}`}
            >
              <span className="font-mono text-xs">!{bang.trigger}</span>
              <span className="ml-1 text-xs">{bang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
