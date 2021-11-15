import clsx from "clsx"
import { useTransition } from "remix"
import { LoadingIcon } from "../ui/LoadingIcon"

export function NavigationIndicator() {
  const { state } = useTransition()
  const navigating = state !== "idle"

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
