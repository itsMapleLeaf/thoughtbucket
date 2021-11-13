import { useEffect, useState } from "react"
import type { Observable } from "rxjs"
import { useEffectRef } from "../react/useEffectRef"

export function useObservable<Value, Fallback>(
  observable: Observable<Value> | undefined,
  fallback: Fallback,
): Value | Fallback {
  const [value, setValue] = useState<Value | Fallback>(fallback)
  const fallbackRef = useEffectRef(fallback)

  useEffect(() => {
    setValue(fallbackRef.current)
    const subscription = observable?.subscribe(setValue)
    return () => subscription?.unsubscribe()
  }, [fallbackRef, observable])

  return value
}
