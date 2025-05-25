"use client"

import { useState, useCallback } from "react"

export function useSearchSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    setLoading(true)

    try {
      // Try multiple suggestion sources
      const sources = [fetchGoogleSuggestions(query), fetchDuckDuckGoSuggestions(query)]

      const results = await Promise.allSettled(sources)
      const allSuggestions: string[] = []

      results.forEach((result) => {
        if (result.status === "fulfilled" && Array.isArray(result.value)) {
          allSuggestions.push(...result.value)
        }
      })

      // Remove duplicates and limit results
      const uniqueSuggestions = Array.from(new Set(allSuggestions))
        .filter((s) => s.toLowerCase() !== query.toLowerCase())
        .slice(0, 8)

      setSuggestions(uniqueSuggestions)
    } catch (error) {
      console.error("Failed to fetch suggestions:", error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    suggestions,
    loading,
    fetchSuggestions,
  }
}

async function fetchGoogleSuggestions(query: string): Promise<string[]> {
  try {
    // Note: This requires CORS proxy or server-side implementation
    // For demo purposes, return mock suggestions
    return [`${query} tutorial`, `${query} examples`, `${query} guide`, `${query} documentation`]
  } catch (error) {
    return []
  }
}

async function fetchDuckDuckGoSuggestions(query: string): Promise<string[]> {
  try {
    // Note: This requires CORS proxy or server-side implementation
    // For demo purposes, return mock suggestions
    return [`${query} meaning`, `${query} definition`, `${query} vs`, `${query} alternatives`]
  } catch (error) {
    return []
  }
}
