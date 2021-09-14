import React from "react"
import type { ButtonProps } from "../dom/Button"
import { MutationButton } from "../state/MutationButton"
import { bucketQueryKey, renameBucket } from "./data"

export function RenameBucketButton({
  bucket,
  onSuccess,
  ...props
}: ButtonProps & {
  bucket: { id: string; name: string }
  onSuccess?: () => void
}) {
  return (
    <MutationButton
      {...props}
      mutateFn={renameBucket}
      getVariables={() => {
        const newName = prompt("new name?", bucket.name)
        if (newName) return { id: bucket.id, name: newName }
      }}
      onSuccess={({ client }) => {
        client.invalidateQueries(bucketQueryKey)
        onSuccess?.()
      }}
    />
  )
}
