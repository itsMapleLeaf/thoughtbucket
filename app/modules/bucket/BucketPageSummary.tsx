import React from "react"
import { DateTime } from "../dom/DateTime"

export function BucketPageSummary({
  name,
  createdAt,
}: {
  name: string
  createdAt: string
}) {
  return (
    <div>
      <h1 className="text-2xl font-light">{name}</h1>
      <p className="text-sm italic lowercase opacity-60">
        created on{" "}
        <DateTime date={createdAt} dateStyle="long" timeStyle="short" />
      </p>
    </div>
  )
}
