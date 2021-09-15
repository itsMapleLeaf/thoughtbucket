import { PlusIcon } from "@heroicons/react/solid"
import React, { useState } from "react"
import { Button } from "../dom/Button"
import { fadedButtonClass } from "../ui/button"
import { inlineIconClass } from "../ui/icon"
import { textInputClass } from "../ui/input"

export function NewColumnForm({}: {}) {
  const [name, setName] = useState("")

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        setName("")
      }}
    >
      <input
        aria-label="column name"
        placeholder="add a new column..."
        required
        className={textInputClass}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Button type="submit" title="add column" className={fadedButtonClass}>
        <PlusIcon className={inlineIconClass} />
      </Button>
    </form>
  )
}
