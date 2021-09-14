import type { ReactNode } from "react"
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type ContextValue = {
  setTitle: (title: string) => void
}

const Context = createContext<ContextValue | undefined>(undefined)

export function DocumentTitle(props: { title: string; children: ReactNode }) {
  const [nestedTitle, setNestedTitle] = useState<string>()
  const parentContext = useContext(Context)
  const title = [nestedTitle, props.title].filter(Boolean).join(" | ")

  useEffect(() => {
    if (parentContext) {
      parentContext.setTitle(title)
    } else {
      document.title = title
    }
  }, [parentContext, title])

  const context = useMemo<ContextValue>(
    () => ({ setTitle: setNestedTitle }),
    [],
  )

  return <Context.Provider value={context}>{props.children}</Context.Provider>
}
