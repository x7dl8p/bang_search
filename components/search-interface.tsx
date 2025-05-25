"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search } from "lucide-react"
import { BangChips } from "./bang-chips"
import { SearchSuggestions } from "./search-suggestions"
import { SearchHistory } from "./search-history"
import { BangSuggestions } from "./bang-suggestions"
import { useBangs } from "@/hooks/use-bangs"
import { useSearchHistory } from "@/hooks/use-search-history"
import { useSearchSuggestions } from "@/hooks/use-search-suggestions"
import { debounce } from "@/lib/utils"

export function SearchInterface() {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { bangs, getFilteredBangs, getBangByTrigger, getPopularBangs } = useBangs()
  const { history, addToHistory, clearHistory } = useSearchHistory()
  const { suggestions, loading, fetchSuggestions } = useSearchSuggestions()

  // Debounced search suggestions
  const debouncedFetchSuggestions = useCallback(
    debounce((q: string) => {
      if (q.trim()) {
        // Remove bang from query for search suggestions
        const cleanQuery = q.replace(/^!\w+\s*/, "").trim()
        if (cleanQuery) {
          fetchSuggestions(cleanQuery)
        } else if (!q.startsWith("!")) {
          fetchSuggestions(q)
        }
      }
    }, 300),
    [fetchSuggestions],
  )

  useEffect(() => {
    debouncedFetchSuggestions(query)
  }, [query, debouncedFetchSuggestions])

  // Handle clicks outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setShowHistory(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setShowSuggestions(true)
    setShowHistory(false)
  }

  const handleInputFocus = () => {
    if (!query.trim()) {
      setShowHistory(true)
      setShowSuggestions(false)
    } else {
      setShowSuggestions(true)
      setShowHistory(false)
    }
  }

  const handleBangClick = (bang: string) => {
    setQuery(bang + " ")
    inputRef.current?.focus()
    setShowSuggestions(true)
    setShowHistory(false)
  }

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (!finalQuery.trim()) return

    addToHistory(finalQuery)

    // Check if query starts with a bang
    const bangMatch = finalQuery.match(/^!(\w+)\s*(.*)/)
    if (bangMatch) {
      const [, trigger, searchTerm] = bangMatch
      const bang = getBangByTrigger(trigger)
      if (bang) {
        const searchUrl = bang.url.replace("{{{s}}}", encodeURIComponent(searchTerm || ""))
        window.open(searchUrl, "_blank")
        setQuery("")
        setShowSuggestions(false)
        setShowHistory(false)
        return
      }
    }

    // Default to Google search in same tab
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`
    window.location.href = googleUrl
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setShowHistory(false)
    }
  }

  // Get filtered bangs based on query (works for both !g and g)
  const getRelevantBangs = (searchQuery: string): any[] => {
    if (!searchQuery.trim()) return []

    const cleanQuery = searchQuery.startsWith("!") ? searchQuery.slice(1) : searchQuery

    return bangs
      .filter(
        (bang) =>
          bang.trigger.toLowerCase().includes(cleanQuery.toLowerCase()) ||
          bang.name.toLowerCase().includes(cleanQuery.toLowerCase()) ||
          bang.category.toLowerCase().includes(cleanQuery.toLowerCase()) ||
          bang.subcategory.toLowerCase().includes(cleanQuery.toLowerCase()),
      )
      .slice(0, 12) // Show more bangs as chips
  }

  const relevantBangs = getRelevantBangs(query)
  const showBangSuggestions = query.trim() && relevantBangs.length > 0
  const showSearchSuggestions = query.trim() && suggestions.length > 0 && !showHistory

  // Parse query to highlight bang chips in input
  const renderSearchInput = () => {
    const bangMatch = query.match(/^!(\w+)(\s+.*)?$/)

    if (bangMatch) {
      const [, trigger, rest] = bangMatch
      const bang = getBangByTrigger(trigger)

      if (bang) {
        return (
          <div className="relative">
            <div className="absolute left-12 top-1/2 transform -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-200 text-zinc-700 border border-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600">
                {bang.name}
              </span>
            </div>
            <input
              ref={inputRef}
              type="text"
              // Trim leading whitespace but keep internal spaces
              value={rest ? rest.replace(/^\s+/, "") : ""}
              onChange={(e) => {
                const newValue = e.target.value
                setQuery(`!${trigger} ${newValue}`)
              }}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              placeholder="Enter search term..."
              className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:ring-zinc-600 pl-12 pr-4 text-lg"
              style={{ paddingLeft: `${80 + bang.name.length * 7}px` }}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        )
      }
    }

    return (
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder="Search the web or use !bangs..."
        className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:ring-zinc-600 pl-12 pr-4 text-lg"
        autoComplete="off"
        spellCheck="false"
      />
    )
  }

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto px-4 relative">
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 dark:text-zinc-400 w-5 h-5 z-20" />
          {renderSearchInput()}
        </div>

        {/* Suggestions Dropdown */}
        {(showSuggestions || showHistory) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden flex flex-col dark:bg-zinc-900 dark:border-zinc-700">
            {/* Bang Suggestions - Horizontal Chips */}
            {showBangSuggestions && (
              <div className="border-b border-zinc-200 dark:border-zinc-700 h-[150px] overflow-hidden">
                <BangSuggestions bangs={relevantBangs} onSelect={handleBangClick} query={query} />
              </div>
            )}

            {/* Search Suggestions - Below bangs */}
            {showSearchSuggestions && (
              <div className="flex-1 overflow-y-auto">
                <SearchSuggestions suggestions={suggestions} loading={loading} onSelect={handleSearch} query={query} />
              </div>
            )}

            {/* Search History - When no query */}
            {showHistory && (
              <div className="flex-1 overflow-y-auto">
                <SearchHistory
                  history={history}
                  onSelect={(item) => {
                    setQuery(item)
                    setShowHistory(false)
                    setShowSuggestions(true)
                  }}
                  onSearch={handleSearch}
                  onClear={clearHistory}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bang Chips */}
      <BangChips bangs={getPopularBangs()} onBangClick={handleBangClick} />
    </div>
  )
}
