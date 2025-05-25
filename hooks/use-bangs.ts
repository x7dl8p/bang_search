"use client"

import { useState, useEffect } from "react"
import type { Bang, BangData } from "@/types/bang"

export function useBangs() {
  const [bangs, setBangs] = useState<BangData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBangs()
  }, [])

  const loadBangs = async () => {
    try {
      setLoading(true)

      // Try to load from localStorage first
      const cachedBangs = localStorage.getItem("cached-bangs")
      if (cachedBangs) {
        try {
          const parsed = JSON.parse(cachedBangs)
          setBangs(transformBangs(parsed))
        } catch (error) {
          console.error("Failed to parse cached bangs:", error)
        }
      }

      // Use embedded bangs data instead of fetching
      const bangData: Bang[] = getEmbeddedBangs()
      const transformedBangs = transformBangs(bangData)
      setBangs(transformedBangs)

      // Cache the bangs
      localStorage.setItem("cached-bangs", JSON.stringify(bangData))
      localStorage.setItem("bangs-last-updated", Date.now().toString())
    } catch (error) {
      console.error("Failed to load bangs:", error)
      // Fallback to default bangs if loading fails
      setBangs(getDefaultBangs())
    } finally {
      setLoading(false)
    }
  }

  const transformBangs = (rawBangs: Bang[]): BangData[] => {
    return rawBangs.map((bang) => ({
      trigger: bang.t,
      name: bang.s,
      url: bang.u,
      category: bang.c,
      subcategory: bang.sc,
      domain: bang.d,
    }))
  }

  const getDefaultBangs = (): BangData[] => {
    return [
      {
        trigger: "g",
        name: "Google",
        url: "https://www.google.com/search?q={{{s}}}",
        category: "Tech",
        subcategory: "Search",
        domain: "www.google.com",
      },
      {
        trigger: "w",
        name: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Special:Search?search={{{s}}}",
        category: "Reference",
        subcategory: "Encyclopedia",
        domain: "en.wikipedia.org",
      },
      {
        trigger: "yt",
        name: "YouTube",
        url: "https://www.youtube.com/results?search_query={{{s}}}",
        category: "Entertainment",
        subcategory: "Video",
        domain: "www.youtube.com",
      },
      {
        trigger: "gh",
        name: "GitHub",
        url: "https://github.com/search?q={{{s}}}",
        category: "Tech",
        subcategory: "Code",
        domain: "github.com",
      },
      {
        trigger: "so",
        name: "Stack Overflow",
        url: "https://stackoverflow.com/search?q={{{s}}}",
        category: "Tech",
        subcategory: "Programming",
        domain: "stackoverflow.com",
      },
    ]
  }

  const getFilteredBangs = (query: string): BangData[] => {
    if (!query.startsWith("!")) return []

    const searchTerm = query.slice(1).toLowerCase()
    if (!searchTerm) return bangs.slice(0, 10) // Show top 10 when just "!" is typed

    return bangs
      .filter(
        (bang) =>
          bang.trigger.toLowerCase().includes(searchTerm) ||
          bang.name.toLowerCase().includes(searchTerm) ||
          bang.category.toLowerCase().includes(searchTerm) ||
          bang.subcategory.toLowerCase().includes(searchTerm),
      )
      .slice(0, 10) // Limit to 10 results
  }

  const getBangByTrigger = (trigger: string): BangData | undefined => {
    return bangs.find((bang) => bang.trigger.toLowerCase() === trigger.toLowerCase())
  }

  const getPopularBangs = (): BangData[] => {
    const popularTriggers = [
      "g",
      "w",
      "yt",
      "gh",
      "so",
      "reddit",
      "twitter",
      "chatgpt",
      "amazon",
      "netflix",
      "spotify",
      "maps",
      "translate",
      "weather",
    ]
    return bangs.filter((bang) => popularTriggers.includes(bang.trigger))
  }

  const getEmbeddedBangs = (): Bang[] => {
    return [
      {
        c: "Tech",
        d: "www.01net.com",
        r: 0,
        s: "01net",
        sc: "Downloads (apps)",
        t: "01net",
        u: "http://www.01net.com/recherche/recherche.php?searchstring={{{s}}}&chaine=home",
      },
      {
        c: "Entertainment",
        d: "www.bmw2002faq.com",
        r: 0,
        s: "BMW 2002 FAQ",
        sc: "Forum",
        t: "02faq",
        u: "https://www.bmw2002faq.com/search/?q={{{s}}}",
      },
      {
        c: "Entertainment",
        d: "boxofficemojo.com",
        r: 0,
        s: "Box Office Mojo",
        sc: "Movies",
        t: "0bo",
        u: "http://boxofficemojo.com/search/?q={{{s}}}",
      },
      {
        c: "Online Services",
        d: "0to255.com",
        r: 3,
        s: "0to255",
        sc: "Tools",
        t: "0to255",
        u: "http://0to255.com/{{{s}}}",
      },
      {
        c: "News",
        d: "1001boom.com",
        r: 3,
        s: "1001boom",
        sc: "Magazine",
        t: "1001",
        u: "http://1001boom.com/?s={{{s}}}",
      },
      {
        c: "Tech",
        d: "www.1001fonts.com",
        r: 0,
        s: "1001 Fonts",
        sc: "Design",
        t: "1001fonts",
        u: "http://www.1001fonts.com/search.html?search={{{s}}}&x=0&y=0",
      },
      {
        c: "Tech",
        d: "www.101domain.com",
        r: 6,
        s: "101 Domain",
        sc: "Domains",
        t: "101",
        u: "http://www.101domain.com/domain-availability-search.htm?q={{{s}}}&sa.x=0&sa.y=0",
      },
      {
        c: "Tech",
        d: "www.101domain.com",
        r: 0,
        s: "101domain",
        sc: "Domains",
        t: "101domain",
        u: "https://www.101domain.com/domain-availability-search.htm?q={{{s}}}",
      },
      {
        c: "Online Services",
        d: "1122.com.uy",
        r: 0,
        s: "1122",
        sc: "Search",
        t: "1122",
        u: "https://1122.com.uy/buscar/{{{s}}}/todo-el-pais",
      },
      {
        c: "Research",
        d: "www.1177.se",
        r: 5,
        s: "1177 Vårdguiden",
        sc: "Health",
        t: "1177",
        u: "http://www.1177.se/Sok/?q={{{s}}}",
      },
      {
        c: "Research",
        d: "11870.com",
        r: 0,
        s: "11870",
        sc: "Food",
        t: "11870",
        u: "http://11870.com/konsulto?q={{{s}}}",
      },
      {
        c: "Online Services",
        d: "118.dk",
        r: 4,
        s: "TDC 118",
        sc: "Search",
        t: "118",
        u: "http://118.dk/search/go?what={{{s}}}",
      },
      {
        c: "Entertainment",
        d: "www.11freunde.de",
        r: 0,
        s: "11 Freunde",
        sc: "Sports",
        t: "11freunde",
        u: "http://www.11freunde.de/search/gss/{{{s}}}",
      },
      {
        c: "Shopping",
        d: "search.11st.co.kr",
        r: 0,
        s: "11번가",
        sc: "Online (intl)",
        t: "11st",
        u: "http://search.11st.co.kr/SearchPrdAction.tmall?method=getTotalSearchSeller&kwd={{{s}}}",
      },
      {
        c: "Multimedia",
        d: "140journos.com",
        r: 0,
        s: "140journos",
        sc: "General",
        t: "140",
        u: "https://140journos.com/search?q={{{s}}}",
      },
      {
        c: "News",
        d: "14-tage-wettervorhersage.de",
        r: 6,
        s: "14-tage-wettervorhersage.de",
        sc: "Weather",
        t: "14",
        u: "https://14-tage-wettervorhersage.de/suche/?q={{{s}}}&lg=de",
      },
      {
        c: "Online Services",
        d: "b144.co.il",
        r: 0,
        s: "b144",
        sc: "Search",
        t: "144",
        u: "http://b144.co.il/PrivateResults.aspx?&p_name={{{s}}}",
      },
      {
        c: "News",
        d: "www.15min.lt",
        r: 0,
        s: "15min naujienos",
        sc: "Newspaper",
        t: "15min",
        u: "https://www.15min.lt/paieska?q={{{s}}}",
      },
      {
        c: "Tech",
        d: "www.google.com",
        r: 0,
        s: "Google",
        sc: "Search",
        t: "g",
        u: "https://www.google.com/search?q={{{s}}}",
      },
      {
        c: "Reference",
        d: "en.wikipedia.org",
        r: 0,
        s: "Wikipedia",
        sc: "Encyclopedia",
        t: "w",
        u: "https://en.wikipedia.org/wiki/Special:Search?search={{{s}}}",
      },
      {
        c: "Entertainment",
        d: "www.youtube.com",
        r: 0,
        s: "YouTube",
        sc: "Video",
        t: "yt",
        u: "https://www.youtube.com/results?search_query={{{s}}}",
      },
      {
        c: "Tech",
        d: "github.com",
        r: 0,
        s: "GitHub",
        sc: "Code",
        t: "gh",
        u: "https://github.com/search?q={{{s}}}",
      },
      {
        c: "Tech",
        d: "stackoverflow.com",
        r: 0,
        s: "Stack Overflow",
        sc: "Programming",
        t: "so",
        u: "https://stackoverflow.com/search?q={{{s}}}",
      },
      {
        c: "Social",
        d: "www.reddit.com",
        r: 0,
        s: "Reddit",
        sc: "Forum",
        t: "reddit",
        u: "https://www.reddit.com/search/?q={{{s}}}",
      },
      {
        c: "Social",
        d: "twitter.com",
        r: 0,
        s: "Twitter",
        sc: "Social",
        t: "twitter",
        u: "https://twitter.com/search?q={{{s}}}",
      },
      {
        c: "AI",
        d: "chat.openai.com",
        r: 0,
        s: "ChatGPT",
        sc: "AI",
        t: "chatgpt",
        u: "https://chat.openai.com/?q={{{s}}}",
      },
      {
        c: "Shopping",
        d: "www.amazon.com",
        r: 0,
        s: "Amazon",
        sc: "Shopping",
        t: "amazon",
        u: "https://www.amazon.com/s?k={{{s}}}",
      },
      {
        c: "Entertainment",
        d: "www.netflix.com",
        r: 0,
        s: "Netflix",
        sc: "Streaming",
        t: "netflix",
        u: "https://www.netflix.com/search?q={{{s}}}",
      },
      {
        c: "Entertainment",
        d: "open.spotify.com",
        r: 0,
        s: "Spotify",
        sc: "Music",
        t: "spotify",
        u: "https://open.spotify.com/search/{{{s}}}",
      },
      {
        c: "Maps",
        d: "maps.google.com",
        r: 0,
        s: "Google Maps",
        sc: "Maps",
        t: "maps",
        u: "https://www.google.com/maps/search/{{{s}}}",
      },
      {
        c: "Tools",
        d: "translate.google.com",
        r: 0,
        s: "Google Translate",
        sc: "Translation",
        t: "translate",
        u: "https://translate.google.com/?text={{{s}}}",
      },
      {
        c: "Weather",
        d: "weather.com",
        r: 0,
        s: "Weather",
        sc: "Weather",
        t: "weather",
        u: "https://www.google.com/search?q=weather+{{{s}}}",
      },
    ]
  }

  return {
    bangs,
    loading,
    getFilteredBangs,
    getBangByTrigger,
    getPopularBangs,
    refreshBangs: loadBangs,
  }
}
