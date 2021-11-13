import type { ReactNode } from "react"
import { useEffect, useRef } from "react"
import ReactDOM from "react-dom"

export function Portal(props: { children: ReactNode }) {
  const elementRef = useRef<HTMLElement>()

  if (!elementRef.current && typeof window !== "undefined") {
    elementRef.current = document.createElement("react-portal")
    document.body.append(elementRef.current)
  }

  useEffect(() => {
    const element = elementRef.current
    return () => {
      element?.remove()
    }
  }, [])

  return elementRef.current ? (
    ReactDOM.createPortal(props.children, elementRef.current)
  ) : (
    <>{props.children}</>
  )
}
