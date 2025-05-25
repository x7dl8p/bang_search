"use client"

import { useState, useEffect } from "react"

const STORAGE_KEY = "search-history"
const MAX_HISTORY_ITEMS = 50

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY)
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Failed to parse search history:", error)
      }
    }
  }, [])

  const addToHistory = (query: string) => {
    if (!query.trim()) return

    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== query)
      const newHistory = [query, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
      return newHistory
    })
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    history,
    addToHistory,
    clearHistory,
  }
}
