"use client"

import { useState, useEffect } from "react"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallBanner(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstallBanner(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallBanner(false)
  }

  if (!showInstallBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-zinc-200 rounded-xl p-4 shadow-2xl z-50 max-w-sm mx-auto dark:bg-zinc-900 dark:border-zinc-700">
      <div className="flex items-start gap-3">
        <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">
          <Download className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-zinc-900 dark:text-white text-sm">Install Universal Search</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-1">
            Add to your home screen for quick access and offline use
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleInstall}
          className="flex-1 bg-zinc-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-zinc-100"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="px-3 py-2 text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-300 text-sm transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  )
}
