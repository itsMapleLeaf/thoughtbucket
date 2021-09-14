import React from "react"
import type { ButtonProps } from "../dom/Button"
import { MutationButton } from "../state/MutationButton"
import { bucketQueryKey, deleteBucket } from "./data"

export function DeleteBucketButton({
  bucket,
  onSuccess,
  ...props
}: ButtonProps & {
  bucket: { id: string }
  onSuccess?: () => void
}) {
  return (
    <MutationButton
      {...props}
      mutateFn={deleteBucket}
      getVariables={() => {
        if (confirm("are you sure you want to delete this bucket?")) {
          return bucket.id
        }
      }}
      onSuccess={({ client }) => {
        client.invalidateQueries(bucketQueryKey)
        onSuccess?.()
      }}
    />
  )
}
