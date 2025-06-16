"use client";

import { useState, useEffect } from "react";
import type { Bang, BangData } from "@/types/bang";

export function useBangs() {
  const [bangs, setBangs] = useState<BangData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBangs();
  }, []);

  const loadBangs = async () => {
    try {
      setLoading(true);

      // Try to load from localStorage first
      const cachedBangs = localStorage.getItem("cached-bangs");
      if (cachedBangs) {
        try {
          const parsed = JSON.parse(cachedBangs);
          setBangs(transformBangs(parsed));
        } catch (error) {
          console.error("Failed to parse cached bangs:", error);
        }
      }

      // Use embedded bangs data instead of fetching
      const bangData: Bang[] = getEmbeddedBangs();
      const transformedBangs = transformBangs(bangData);
      setBangs(transformedBangs);

      // Cache the bangs
      localStorage.setItem("cached-bangs", JSON.stringify(bangData));
      localStorage.setItem("bangs-last-updated", Date.now().toString());
    } catch (error) {
      console.error("Failed to load bangs:", error);
      // Fallback to default bangs if loading fails
      setBangs(getDefaultBangs());
    } finally {
      setLoading(false);
    }
  };

  const transformBangs = (rawBangs: Bang[]): BangData[] => {
    return rawBangs.map((bang) => ({
      trigger: bang.t,
      name: bang.s,
      url: bang.u,
      category: bang.c,
      subcategory: bang.sc,
      domain: bang.d,
    }));
  };

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
    ];
  };

  const getFilteredBangs = (query: string): BangData[] => {
    if (!query.startsWith("!")) return [];

    const searchTerm = query.slice(1).toLowerCase();
    if (!searchTerm) return bangs.slice(0, 10); // Show top 10 when just "!" is typed

    return bangs
      .filter(
        (bang) =>
          bang.trigger.toLowerCase().includes(searchTerm) ||
          bang.name.toLowerCase().includes(searchTerm) ||
          bang.category.toLowerCase().includes(searchTerm) ||
          bang.subcategory.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10); // Limit to 10 results
  };

  const getBangByTrigger = (trigger: string): BangData | undefined => {
    return bangs.find(
      (bang) => bang.trigger.toLowerCase() === trigger.toLowerCase()
    );
  };

  const getPopularBangs = (): BangData[] => {
    // Return all bangs instead of filtering by a predefined list
    return bangs;
  };

const getEmbeddedBangs = (): Bang[] => {
  return [
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
      c: "Religion",
      d: "islamqa.info",
      r: 0,
      s: "Islam Q&A",
      sc: "Islamic Answers",
      t: "islamqa",
      u: "https://islamqa.info/en/search?q={{{s}}}",
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
    {
      c: "Apps",
      d: "apkdone.com",
      r: 0,
      s: "APKDone",
      sc: "Apps",
      t: "apkdone",
      u: "https://apkdone.com/?s={{{s}}}",
    },
    {
      c: "Apps",
      d: "search.f-droid.org",
      r: 0,
      s: "F-Droid",
      sc: "Apps",
      t: "fdroid",
      u: "https://search.f-droid.org/?q={{{s}}}&lang=en",
    },
    {
      c: "Entertainment",
      d: "hianime.to",
      r: 0,
      s: "HiAnime",
      sc: "Anime",
      t: "hianime",
      u: "https://hianime.to/search?keyword={{{s}}}",
    },
    {
      c: "Shopping",
      d: "www.flipkart.com",
      r: 0,
      s: "Flipkart",
      sc: "Shopping",
      t: "flipkart",
      u: "https://www.flipkart.com/search?q={{{s}}}",
    },
    {
      c: "Apps",
      d: "liteapks.com",
      r: 0,
      s: "LiteAPKs",
      sc: "Apps",
      t: "liteapks",
      u: "https://liteapks.com/?s={{{s}}}",
    },
    {
      c: "Social",
      d: "in.pinterest.com",
      r: 0,
      s: "Pinterest India",
      sc: "Pins",
      t: "pinterest",
      u: "https://in.pinterest.com/search/pins/?q={{{s}}}",
    },
    {
      c: "Apps",
      d: "chromewebstore.google.com",
      r: 0,
      s: "Chrome Web Store",
      sc: "Extensions",
      t: "chromewebstore",
      u: "https://chrome.google.com/webstore/search/{{{s}}}",
    },
    {
      c: "Archive",
      d: "web.archive.org",
      r: 0,
      s: "Wayback Machine",
      sc: "Archive",
      t: "archive",
      u: "https://web.archive.org/web/*/{{{s}}}",
    },
    {
      c: "AI",
      d: "v0.dev",
      r: 0,
      s: "V0 Dev",
      sc: "AI",
      t: "v0",
      u: "https://v0.dev/chat?q={{{s}}}",
    },
    {
      c: "Anime",
      d: "kayoanime.com",
      r: 0,
      s: "KayoAnime",
      sc: "Anime",
      t: "kayoanime",
      u: "https://kayoanime.com/?s={{{s}}}",
    },
    {
      c: "AI",
      d: "huggingface.co",
      r: 0,
      s: "Hugging Face",
      sc: "AI",
      t: "huggingface",
      u: "https://huggingface.co/search/full-text?q={{{s}}}",
    },
    {
      c: "Religion",
      d: "www.noor-book.com",
      r: 0,
      s: "Noor Book",
      sc: "Books",
      t: "noor",
      u: "https://www.noor-book.com/en/?search_for={{{s}}}",
    },
    {
      c: "AI",
      d: "perplexity.ai",
      r: 0,
      s: "Perplexity",
      sc: "Answer Engine",
      t: "ppx",
      u: "https://www.perplexity.ai/search/?q={{{s}}}",
    },
    {
      c: "Search",
      d: "search.yahoo.com",
      r: 0,
      s: "Yahoo",
      sc: "Search",
      t: "yahoo",
      u: "https://search.yahoo.com/search?p={{{s}}}",
    },
  ];
};


  return {
    bangs,
    loading,
    getFilteredBangs,
    getBangByTrigger,
    getPopularBangs,
    refreshBangs: loadBangs,
  };
}