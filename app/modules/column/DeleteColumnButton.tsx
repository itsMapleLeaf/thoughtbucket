import { TrashIcon } from "@heroicons/react/solid"
import { Form } from "remix"
import { Button } from "../dom/Button"
import { fadedButtonClass } from "../ui/button"
import { leftButtonIconClass } from "../ui/icon"

export function DeleteColumnButton({
  bucket,
  column,
}: {
  bucket: { id: string }
  column: { id: string }
}) {
  return (
    <Form action={`/buckets/${bucket.id}`} method="patch">
      <input type="hidden" name="deleteColumn.id" value={column.id} />
      <Button
        type="submit"
        className={fadedButtonClass}
        title="delete this column"
      >
        <TrashIcon className={leftButtonIconClass} />
      </Button>
    </Form>
  )
}
