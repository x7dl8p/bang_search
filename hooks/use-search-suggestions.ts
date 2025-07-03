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
      // First try our API route (server-side, bypasses CORS)
      const apiResponse = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`)
      
      if (apiResponse.ok) {
        const data = await apiResponse.json()
        if (data.suggestions && Array.isArray(data.suggestions)) {
          const uniqueSuggestions = data.suggestions
            .filter((s: string) => s.toLowerCase() !== query.toLowerCase())
            .slice(0, 8)
          setSuggestions(uniqueSuggestions)
          return
        }
      }

      // Fallback to client-side alternatives
      const suggestions = await fetchDuckDuckGoSuggestions(query)
      
      const uniqueSuggestions = suggestions
        .filter((s: string) => s.toLowerCase() !== query.toLowerCase())
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

async function fetchDuckDuckGoSuggestions(query: string): Promise<string[]> {
  try {
    // Try multiple approaches for getting suggestions
    
    // Approach 1: Try Wikipedia OpenSearch (has CORS support)
    const wikipediaResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=5&format=json&origin=*`
    )
    
    if (wikipediaResponse.ok) {
      const wikipediaData = await wikipediaResponse.json()
      if (Array.isArray(wikipediaData) && Array.isArray(wikipediaData[1])) {
        return wikipediaData[1]
      }
    }
    
    // Approach 2: Use Datamuse API for word suggestions
    const datamuseResponse = await fetch(
      `https://api.datamuse.com/sug?s=${encodeURIComponent(query)}&max=8`
    )
    
    if (datamuseResponse.ok) {
      const datamuseData = await datamuseResponse.json()
      if (Array.isArray(datamuseData)) {
        return datamuseData.map((item: any) => item.word || item.suggestion || '').filter(Boolean)
      }
    }
    
    // Fallback: Generate contextual suggestions
    return generateFallbackSuggestions(query)
    
  } catch (error) {
    console.error('All suggestion sources failed:', error)
    return generateFallbackSuggestions(query)
  }
}

function generateFallbackSuggestions(query: string): string[] {
  if (!query.trim()) return []
  
  const suggestions = [
    `${query} tutorial`,
    `${query} guide`,
    `${query} examples`,
    `${query} documentation`,
    `${query} vs`,
    `how to ${query}`,
    `what is ${query}`,
    `${query} alternatives`
  ]
  
  return suggestions.slice(0, 5)
}
