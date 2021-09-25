import clsx from "clsx"
import type { ReactNode } from "react"
import { createContext, useContext } from "react"
import { cardClass } from "../ui/card"
import { LoadingIcon } from "../ui/LoadingIcon"

const PendingContext = createContext(false)

export function ColumnCard({
  children,
  pending = false,
}: {
  children: ReactNode
  pending?: boolean
}) {
  return (
    <section
      className={clsx(
        cardClass,
        "flex flex-col transition-opacity",
        pending && "opacity-50",
      )}
    >
      <PendingContext.Provider value={pending}>
        {children}
      </PendingContext.Provider>
    </section>
  )
}

ColumnCard.listClass =
  "grid items-start content-start flex-1 min-h-0 gap-3 px-3 pb-3 overflow-y-auto transform-gpu"

ColumnCard.sectionClass = "px-3 pb-3"

ColumnCard.Header = function Header({
  title,
  right,
}: {
  title: ReactNode
  right?: ReactNode
}) {
  const pending = useContext(PendingContext)
  return (
    <div className="flex items-start gap-3 p-3">
      <h3 className="text-lg font-light leading-tight">{title}</h3>
      {pending && <LoadingIcon size={2} />}
      <div className="ml-auto">{right}</div>
    </div>
  )
}
