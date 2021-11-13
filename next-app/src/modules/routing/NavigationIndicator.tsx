import clsx from "clsx"
import { LoadingIcon } from "../ui/LoadingIcon"
import { useRouterStatus } from "./useRouterStatus"

export function NavigationIndicator() {
  const status = useRouterStatus()
  const navigating = status === "navigating"

  return (
    <div
      className={clsx(
        "fixed bottom-0 left-0 p-8 transition-opacity duration-300 pointer-events-none",
        navigating ? "opacity-100" : "opacity-0",
      )}
      style={{ transitionDelay: navigating ? "0.5s" : "0s" }}
    >
      <LoadingIcon size={4} />
    </div>
  )
}
