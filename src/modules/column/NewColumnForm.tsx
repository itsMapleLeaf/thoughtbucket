import { PlusIcon } from "@heroicons/react/solid"
import { Form } from "next-runtime/form"
import React, { useState } from "react"
import { Button } from "../dom/Button"
import { fadedButtonClass } from "../ui/button"
import { inlineIconClass } from "../ui/icon"
import { textInputClass } from "../ui/input"

export function NewColumnForm({ bucket }: { bucket: { id: string } }) {
  const [name, setName] = useState("")
  return (
    <Form
      action={`/buckets/${bucket.id}`}
      method="patch"
      className="flex gap-2"
      onSubmit={() => setName("")}
    >
      <input
        type="text"
        name="createColumn.name"
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
    </Form>
  )
}
