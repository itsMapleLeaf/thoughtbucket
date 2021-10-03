import type { RouterEvent } from "next/router"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export type RouterStatus = "idle" | "navigating" | "error"

export function useRouterStatus() {
  const [status, setStatus] = useState<RouterStatus>("idle")
  useRouterEvent("routeChangeStart", () => setStatus("navigating"))
  useRouterEvent("routeChangeComplete", () => setStatus("idle"))
  useRouterEvent("routeChangeError", () => setStatus("error"))
  return status
}

function useRouterEvent(event: RouterEvent, listener: () => void) {
  const router = useRouter()
  useEffect(() => {
    router.events.on(event, listener)
    return () => router.events.off(event, listener)
  })
}
