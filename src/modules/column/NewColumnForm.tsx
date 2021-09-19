import React from "react"
import { QuickInsertForm } from "../ui/QuickInsertForm"

export function NewColumnForm({ bucket }: { bucket: { id: string } }) {
  return (
    <QuickInsertForm action={`/buckets/${bucket.id}`} method="patch">
      <QuickInsertForm.Input
        name="createColumn.name"
        placeholder="add a new column..."
        label="column name"
      />
      <QuickInsertForm.Button title="add column" />
    </QuickInsertForm>
  )
}
