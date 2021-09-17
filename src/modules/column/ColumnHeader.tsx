import { TrashIcon } from "@heroicons/react/solid"
import type { ReactNode } from "react"
import React from "react"
import { Button } from "../dom/Button"
import { fadedButtonClass } from "../ui/button"

export function ColumnHeader({ title }: { title: ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <h3 className="mr-auto text-lg font-light leading-tight">{title}</h3>
      <Button title="delete this column" className={fadedButtonClass}>
        <TrashIcon className="w-5" />
      </Button>
    </div>
  )
}
