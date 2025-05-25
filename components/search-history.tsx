"use client"

import { Clock, Trash2, Search } from "lucide-react"

interface SearchHistoryProps {
  history: string[]
  onSelect: (item: string) => void
  onSearch: (query: string) => void
  onClear: () => void
}

export function SearchHistory({ history, onSelect, onSearch, onClear }: SearchHistoryProps) {
  if (history.length === 0) {
    return <div className="p-4 text-center text-zinc-400 dark:text-zinc-500 text-sm">No search history yet</div>
  }

  return (
    <div className="py-2">
      <div className="px-3 py-1 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700">
        <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Recent Searches
        </span>
        <button
          onClick={onClear}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>
      {history.slice(0, 10).map((item, index) => (
        <div
          key={index}
          className="px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors duration-150 flex items-center gap-3 group"
        >
          <Clock className="w-4 h-4 text-zinc-400 dark:text-zinc-400" />
          <span
            className="text-sm flex-1 cursor-pointer text-zinc-900 dark:text-zinc-100"
            onClick={() => onSelect(item)}
          >
            {item}
          </span>
          <button
            onClick={() => onSearch(item)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
            title="Search again"
          >
            <Search className="w-3 h-3 text-zinc-400 dark:text-zinc-400" />
          </button>
        </div>
      ))}
    </div>
  )
}
