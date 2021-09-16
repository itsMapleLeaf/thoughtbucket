import { usePendingFormSubmit } from "next-runtime/form"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export function usePendingNavigation() {
  const router = useRouter()
  const [navigating, setNavigating] = useState(false)
  const pending = usePendingFormSubmit()

  useEffect(() => {
    const handleRouteChangeStart = () => setNavigating(true)
    const handleRouteChangeComplete = () => setNavigating(false)

    router.events.on("routeChangeStart", handleRouteChangeStart)
    router.events.on("routeChangeComplete", handleRouteChangeComplete)

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart)
      router.events.off("routeChangeComplete", handleRouteChangeComplete)
    }
  }, [router.events])

  return navigating || pending
}
