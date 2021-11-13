import { TrashIcon, ViewGridIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import Link from "next/link"
import React from "react"
import { fadedButtonClass } from "../ui/button"
import { cardClass } from "../ui/card"
import { activePressClass } from "../ui/effects"
import { inlineIconClass } from "../ui/icon"
import { DeleteBucketButton } from "./DeleteBucketButton"

export function BucketSummaryCard({
  bucket,
}: {
  bucket: { id: string; name: string }
}) {
  return (
    <div className="relative">
      <Link href={`/buckets/${bucket.id}`}>
        <a
          title={`view bucket ${bucket.name}`}
          className={clsx(
            cardClass,
            activePressClass,
            "flex items-center h-full gap-2 pr-10 p-4 transition hover:bg-slate-600",
          )}
        >
          <ViewGridIcon className="inline w-5" />

          <div className="flex-1">
            <h2 className="text-xl leading-tight text-shadow">{bucket.name}</h2>
          </div>
        </a>
      </Link>

      <DeleteBucketButton
        bucket={bucket}
        title="delete bucket"
        className={clsx(fadedButtonClass, "absolute right-2 bottom-2")}
      >
        <TrashIcon className={inlineIconClass} />
        <span className="sr-only">delete</span>
      </DeleteBucketButton>
    </div>
  )
}
