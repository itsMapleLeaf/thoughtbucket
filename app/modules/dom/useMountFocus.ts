import { useCallback, useEffect, useRef } from "react"

export function useMountFocus() {
  const ref = useRef<HTMLElement | null>()
  useEffect(() => {
    ref.current?.focus()
  }, [])

  // a callback is more TS-friendly than returning the ref directly
  // the alternative is requiring the user to define the element type
  return useCallback((element: HTMLElement | null) => {
    ref.current = element
  }, [])
}
