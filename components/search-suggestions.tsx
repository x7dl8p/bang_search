"use client"

import { Search, Loader2 } from "lucide-react"

interface SearchSuggestionsProps {
  suggestions: string[]
  loading: boolean
  onSelect: (suggestion: string) => void
  query: string
}

export function SearchSuggestions({ suggestions, loading, onSelect, query }: SearchSuggestionsProps) {
  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-zinc-400 dark:text-zinc-400" />
        <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">Loading suggestions...</span>
      </div>
    )
  }

  if (suggestions.length === 0) {
    return <div className="p-4 text-center text-zinc-400 dark:text-zinc-500 text-sm">No suggestions found</div>
  }

  return (
    <div className="py-2">
      <div className="px-3 py-1 text-xs text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700">
        Search Suggestions
      </div>
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          onClick={() => onSelect(suggestion)}
          className="px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors duration-150 flex items-center gap-3"
        >
          <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-400" />
          <span className="text-sm text-zinc-900 dark:text-zinc-100">{suggestion}</span>
        </div>
      ))}
    </div>
  )
}
