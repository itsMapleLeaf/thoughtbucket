import { TrashIcon } from "@heroicons/react/solid"
import React, { ReactNode } from "react"
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
