import { useEffect, useRef } from "react"

// ts-unused-exports:disable-next-line
export function useEffectRef<T>(value: T): { readonly current: T } {
  const ref = useRef<T>(value)
  useEffect(() => {
    ref.current = value
  })
  return ref
}
