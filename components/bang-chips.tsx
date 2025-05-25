"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { BangData } from "@/types/bang"

interface BangChipsProps {
  bangs: BangData[]
  onBangClick: (bang: string) => void
}

export function BangChips({ bangs, onBangClick }: BangChipsProps) {
  const [showAll, setShowAll] = useState(false)

  const displayBangs = showAll ? bangs.slice(0, 50) : bangs.slice(0, 12)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Quick Bangs</h3>
        {bangs.length > 12 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 flex items-center gap-1 transition-colors"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {displayBangs.map((bang) => (
          <button
            key={bang.trigger}
            onClick={() => onBangClick(`!${bang.trigger}`)}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 cursor-pointer transition-colors duration-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 group"
            title={`${bang.name} - ${bang.category}`}
          >
            <span className="font-mono">!{bang.trigger}</span>
            <span className="ml-1 text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-colors">
              {bang.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
