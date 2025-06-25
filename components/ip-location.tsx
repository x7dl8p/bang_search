"use client"

import { useEffect, useState } from "react"

export function IPLocation() {
  const [locationData, setLocationData] = useState<{
    city?: string
    country?: string
    ip?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true;
    
    const fetchLocation = async () => {
      try {
        // Use a timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('https://ipapi.co/json/', { 
          signal: controller.signal,
          next: { revalidate: 3600 }, // Revalidate once per hour
          headers: {
            'Accept': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        
        if (isMounted) {
          const data = await response.json();
          setLocationData({
            city: data.city || 'Unknown',
            country: data.country_name || '',
            ip: data.ip || 'Unknown',
          });
        }
      } catch (err) {
        console.error("Location fetch failed:", err);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Delay the fetch slightly to avoid initial render issues
    const timer = setTimeout(() => {
      fetchLocation();
    }, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Safe rendering with error handling
  if (error) {
    return null; // Silently fail
  }
  
  if (loading) {
    return <div className="text-xs text-zinc-400 dark:text-zinc-500">Loading...</div>;
  }

  // Defensively check for data
  if (!locationData || !locationData.city) {
    return null;
  }

  return (
    <div className="text-xs text-zinc-400 dark:text-zinc-500 flex flex-col items-end">
      {locationData.city && 
        <div>
          {locationData.city}
          {locationData.country ? `, ${locationData.country}` : ''}
        </div>
      }
      {locationData.ip && <div>{locationData.ip}</div>}
    </div>
  );
}