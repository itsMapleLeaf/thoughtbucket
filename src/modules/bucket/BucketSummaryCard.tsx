import { TrashIcon, ViewGridIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import React from "react"
import { Link } from "wouter"
import { fadedButtonClass } from "../ui/button"
import { activePressClass } from "../ui/effects"
import { inlineIconClass } from "../ui/icon"
import { DeleteBucketButton } from "./DeleteBucketButton"

export function BucketSummaryCard({
  bucket,
}: {
  bucket: { id: string; name: string }
}) {
  return (
    <div
      className={clsx(
        activePressClass,
        "relative flex items-center h-full gap-2 p-4 pr-10 transition bg-gray-700 rounded-md shadow hover:bg-gray-600",
      )}
    >
      <ViewGridIcon className="inline w-5" />

      <div className="flex-1">
        <h2 className="text-xl leading-tight text-shadow">{bucket.name}</h2>
      </div>

      <Link
        to={`/bucket/${bucket.id}`}
        className="absolute inset-0"
        title="view bucket"
      />

      <DeleteBucketButton
        title="delete bucket"
        className={clsx(fadedButtonClass, "absolute right-2 bottom-2")}
        bucket={bucket}
      >
        <TrashIcon className={inlineIconClass} />
        <span className="sr-only">delete</span>
      </DeleteBucketButton>
    </div>
  )
}
