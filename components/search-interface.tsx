"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X } from "lucide-react" // Added X icon import
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
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(-1)
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
    // Reset selections when query changes
    setSelectedSuggestionIndex(-1)
    setSelectedHistoryIndex(-1)
  }, [query, debouncedFetchSuggestions])

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Handle clicks outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setShowHistory(false)
        setSelectedSuggestionIndex(-1)
        setSelectedHistoryIndex(-1)
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
    setSelectedSuggestionIndex(-1)
    setSelectedHistoryIndex(-1)
  }

  const handleInputFocus = () => {
    if (!query.trim()) {
      setShowHistory(true)
      setShowSuggestions(false)
    } else {
      setShowSuggestions(true)
      setShowHistory(false)
    }
    setSelectedSuggestionIndex(-1)
    setSelectedHistoryIndex(-1)
  }

  const handleBangClick = (bang: string) => {
    setQuery(bang + " ")
    setShowSuggestions(true)
    setShowHistory(false)
    setSelectedSuggestionIndex(-1)
    setSelectedHistoryIndex(-1)
    // Focus the input after bang selection
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
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
        setSelectedSuggestionIndex(-1)
        setSelectedHistoryIndex(-1)
        return
      }
    }

    // Default to Google search in same tab
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`
    window.location.href = googleUrl
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (showSuggestions && suggestions.length > 0) {
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        setSelectedHistoryIndex(-1) // Reset history selection
      } else if (showHistory && history.length > 0) {
        setSelectedHistoryIndex(prev => 
          prev < Math.min(history.length - 1, 9) ? prev + 1 : 0 // Max 10 history items
        )
        setSelectedSuggestionIndex(-1) // Reset suggestions selection
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (showSuggestions && suggestions.length > 0) {
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        setSelectedHistoryIndex(-1) // Reset history selection
      } else if (showHistory && history.length > 0) {
        const maxHistoryIndex = Math.min(history.length - 1, 9) // Max 10 history items
        setSelectedHistoryIndex(prev => 
          prev > 0 ? prev - 1 : maxHistoryIndex
        )
        setSelectedSuggestionIndex(-1) // Reset suggestions selection
      }
    } else if (e.key === "Enter") {
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        // Check if we have a bang selected
        const bangMatch = query.match(/^!(\w+)(\s+.*)?$/)
        if (bangMatch) {
          const [, trigger] = bangMatch
          // Set the suggestion in the input field, don't search yet
          setQuery(`!${trigger} ${suggestions[selectedSuggestionIndex]}`)
          setShowSuggestions(false)
          setShowHistory(false)
          setSelectedSuggestionIndex(-1)
          setSelectedHistoryIndex(-1)
          // Keep focus on input
          setTimeout(() => {
            inputRef.current?.focus()
          }, 0)
        } else {
          // No bang selected, search the suggestion immediately
          handleSearch(suggestions[selectedSuggestionIndex])
        }
      } else if (selectedHistoryIndex >= 0 && history[selectedHistoryIndex]) {
        setQuery(history[selectedHistoryIndex])
        setShowHistory(false)
        setShowSuggestions(true)
        setSelectedHistoryIndex(-1)
        setSelectedSuggestionIndex(-1)
        // Keep focus on input
        setTimeout(() => {
          inputRef.current?.focus()
        }, 0)
      } else {
        handleSearch()
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setShowHistory(false)
      setSelectedSuggestionIndex(-1)
      setSelectedHistoryIndex(-1)
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
            <div className="absolute left-12 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-10">
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-200 text-zinc-700 border border-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600">
                <span>{bang.name}</span>
                <button
                  onClick={() => setQuery("")}
                  className="ml-1 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-600 flex items-center justify-center w-4 h-4"
                  aria-label="Clear bang"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
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
              style={{ paddingLeft: `${90 + bang.name.length * 8}px` }}
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
        className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:ring-zinc-600 pl-12 pr-4 text-lg placeholder:text-sm"
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
                <SearchSuggestions 
                  suggestions={suggestions} 
                  loading={loading} 
                  onSelect={(suggestion) => {
                    // Check if we have a bang selected
                    const bangMatch = query.match(/^!(\w+)(\s+.*)?$/)
                    if (bangMatch) {
                      const [, trigger] = bangMatch
                      // Set the suggestion in the input field, don't search yet
                      setQuery(`!${trigger} ${suggestion}`)
                      setShowSuggestions(false)
                      setShowHistory(false)
                      setSelectedSuggestionIndex(-1)
                      setSelectedHistoryIndex(-1)
                      // Keep focus on input
                      setTimeout(() => {
                        inputRef.current?.focus()
                      }, 0)
                    } else {
                      // No bang selected, search the suggestion immediately
                      handleSearch(suggestion)
                    }
                  }} 
                  query={query}
                  selectedIndex={selectedSuggestionIndex} 
                />
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
                    setSelectedHistoryIndex(-1)
                    setSelectedSuggestionIndex(-1)
                    // Keep focus on input
                    setTimeout(() => {
                      inputRef.current?.focus()
                    }, 0)
                  }}
                  onSearch={handleSearch}
                  onClear={clearHistory}
                  selectedIndex={selectedHistoryIndex}
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
