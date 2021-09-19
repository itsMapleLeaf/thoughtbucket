import { QuickInsertForm } from "../ui/QuickInsertForm"

export function NewThoughtForm({
  bucket,
  column,
}: {
  bucket: { id: string }
  column: { id: string }
}) {
  return (
    <QuickInsertForm action={`/buckets/${bucket.id}`} method="patch">
      <input type="hidden" name="createThought.columnId" value={column.id} />
      <QuickInsertForm.Input
        name="createThought.text"
        placeholder="add a new thought..."
        label="thought text"
      />
      <QuickInsertForm.Button title="add thought" />
    </QuickInsertForm>
  )
}
