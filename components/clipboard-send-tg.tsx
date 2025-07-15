"use client"

import { useState } from "react"
import { CornerRightUp , CheckCircle2, XCircle, BotMessageSquare  } from "lucide-react"

const TG_BOT_TOKEN = process.env.NEXT_PUBLIC_TG_BOT_TOKEN
const TG_CHAT_ID = process.env.NEXT_PUBLIC_TG_CHAT_ID

export function ClipboardSendToTelegram() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const handleSend = async () => {
    setStatus("sending")
    let didTimeout = false
    const timeout = setTimeout(() => {
      didTimeout = true
      setStatus("error")
      setTimeout(() => setStatus("idle"), 1000)
    }, 1000)

    try {
      const text = await navigator.clipboard.readText()
      if (!text) throw new Error("Clipboard is empty.")
      if (!TG_BOT_TOKEN || !TG_CHAT_ID) throw new Error("Bot token or chat ID not set.")

      const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text }),
      })
      const data = await res.json()
      if (!didTimeout) {
        clearTimeout(timeout)
        if (data.ok) {
          setStatus("success")
        } else {
          setStatus("error")
        }
        setTimeout(() => setStatus("idle"), 1500)
      }
    } catch {
      if (!didTimeout) {
        clearTimeout(timeout)
        setStatus("error")
        setTimeout(() => setStatus("idle"), 1500)
      }
    }
  }

  return (
    <button
      onClick={handleSend}
      className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
      aria-label="Send clipboard to Telegram"
      disabled={status === "sending"}
      title="Send clipboard to Telegram"
    >
      {status === "idle" && <BotMessageSquare  className="w-5 h-5 size-sm" />}
      {status === "sending" && <CornerRightUp  className="w-5 h-5 animate-pulse" />}
      {status === "success" && <CheckCircle2 className="w-5 h-5 text-green-400 animate-pulse" />}
      {status === "error" && <XCircle className="w-5 h-5 text-red-400 animate-bounce" />}
    </button>
  )
}