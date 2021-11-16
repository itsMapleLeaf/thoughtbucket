import { useCallback } from "react"
import { useSubmit } from "remix"
import type { UpdateColumnInput } from "./UpdateColumnForm"

export function useUpdateColumnSubmit() {
  const submit = useSubmit()
  return useCallback(
    (columnId: string, body: UpdateColumnInput) => {
      submit(body, { method: "patch", action: `/columns/${columnId}` })
    },
    [submit],
  )
}
