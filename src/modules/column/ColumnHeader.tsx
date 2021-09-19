import type { ReactNode } from "react"
import React from "react"

export function ColumnHeader({
  title,
  right,
}: {
  title: ReactNode
  right?: ReactNode
}) {
  return (
    <div className="flex items-start gap-2">
      <h3 className="mr-auto text-lg font-light leading-tight">{title}</h3>
      {right}
    </div>
  )
}
