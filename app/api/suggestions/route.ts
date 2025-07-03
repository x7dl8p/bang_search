import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  
  if (!query || !query.trim()) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    // Try DuckDuckGo autocomplete (server-side bypasses CORS)
    const duckDuckGoResponse = await fetch(
      `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
        },
      }
    )

    if (duckDuckGoResponse.ok) {
      const data = await duckDuckGoResponse.json()
      if (Array.isArray(data) && Array.isArray(data[1])) {
        return NextResponse.json({ suggestions: data[1] })
      }
    }

    // Fallback to Wikipedia if DuckDuckGo fails
    const wikipediaResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=6&format=json`
    )

    if (wikipediaResponse.ok) {
      const wikipediaData = await wikipediaResponse.json()
      if (Array.isArray(wikipediaData) && Array.isArray(wikipediaData[1])) {
        return NextResponse.json({ suggestions: wikipediaData[1] })
      }
    }

    // Final fallback
    const fallbackSuggestions = [
      `${query} tutorial`,
      `${query} guide`,
      `${query} examples`,
      `how to ${query}`,
      `what is ${query}`
    ]

    return NextResponse.json({ suggestions: fallbackSuggestions })

  } catch (error) {
    console.error('Suggestions API error:', error)
    
    // Return fallback suggestions on error
    const fallbackSuggestions = [
      `${query} tutorial`,
      `${query} guide`,
      `${query} examples`,
      `how to ${query}`,
      `what is ${query}`
    ]

    return NextResponse.json({ suggestions: fallbackSuggestions })
  }
}
