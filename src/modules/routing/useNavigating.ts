import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export function useNavigating() {
  const [navigating, setNavigating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleChangeStart = () => setNavigating(true)
    const handleChangeComplete = () => setNavigating(false)

    router.events.on("routeChangeStart", handleChangeStart)
    router.events.on("routeChangeComplete", handleChangeComplete)

    return () => {
      router.events.off("routeChangeStart", handleChangeStart)
      router.events.off("routeChangeComplete", handleChangeComplete)
    }
  }, [router.events])

  return navigating
}
