import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid"
import React from "react"
import { useQuery } from "react-query"
import { useLocation } from "wouter"
import { ColumnHeader } from "../column/ColumnHeader"
import { columnQueryKey } from "../column/data"
import { NewColumnForm } from "../column/NewColumnForm"
import { extractErrorMessage } from "../common/helpers"
import { DocumentTitle } from "../dom/DocumentTitle"
import { supabaseQuery } from "../supabase/query"
import { ThoughtCard } from "../thought/ThoughtCard"
import { fadedButtonClass } from "../ui/button"
import { containerClass } from "../ui/container"
import { leftButtonIconClass } from "../ui/icon"
import { BucketPageSummary } from "./BucketPageSummary"
import { bucketQueryKey, getBucketDetails } from "./data"
import { DeleteBucketButton } from "./DeleteBucketButton"
import { RenameBucketButton } from "./RenameBucketButton"

export function BucketPage({ bucketId }: { bucketId: string }) {
  const bucketQuery = useQuery({
    queryKey: [bucketQueryKey, bucketId],
    queryFn: () => getBucketDetails(bucketId),
  })

  const columnListQuery = useQuery({
    queryKey: [columnQueryKey, bucketId],
    queryFn: () =>
      supabaseQuery("columns")
        .select(["id", "name", "bucketId"])
        .eq("bucketId", bucketId)
        .select(["id", "name"])
        .all(),
  })

  const [, setLocation] = useLocation()

  const columnScrollContainerRef = React.useRef<HTMLDivElement>(null)

  const scrollRight = () => {
    // call the scroll after react has rendered the dom
    requestIdleCallback(() => {
      columnScrollContainerRef.current?.scrollBy({
        left:
          columnScrollContainerRef.current.clientWidth +
          columnScrollContainerRef.current.scrollWidth,
        behavior: "smooth",
      })
    })
  }

  if (bucketQuery.isLoading) {
    return <p>Loading...</p>
  }

  if (bucketQuery.error) {
    return <p>Error: {extractErrorMessage(bucketQuery.error)}</p>
  }

  if (!bucketQuery.data) {
    return <p>Bucket not found</p>
  }

  return (
    <DocumentTitle title={bucketQuery.data.name}>
      <div className="flex flex-col h-full">
        <section
          className={`flex flex-wrap items-baseline gap-x-4 gap-y-2 ${containerClass}`}
        >
          <div className="mr-auto">
            <BucketPageSummary bucket={bucketQuery.data} />
          </div>

          <div className="flex gap-4">
            <RenameBucketButton
              bucket={bucketQuery.data}
              className={fadedButtonClass}
            >
              <PencilAltIcon className={leftButtonIconClass} /> rename
            </RenameBucketButton>
            <DeleteBucketButton
              className={fadedButtonClass}
              bucket={bucketQuery.data}
              onSuccess={() => setLocation("/")}
            >
              <TrashIcon className={leftButtonIconClass} /> delete
            </DeleteBucketButton>
          </div>
        </section>

        <section
          className="grid grid-flow-col gap-4 p-4 auto-cols-[18rem] grid-rows-1 mx-auto min-w-[min(1024px,100%)] max-w-full overflow-auto flex-1"
          ref={columnScrollContainerRef}
        >
          {columnListQuery.data?.map((column) => (
            <div
              key={column.id}
              className="flex flex-col p-3 bg-gray-900 rounded-md shadow-inner"
            >
              <div className="mb-3">
                <ColumnHeader column={column} />
              </div>

              <div className="grid items-start content-start flex-1 min-h-0 gap-3 overflow-y-auto transform-gpu">
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
              </div>
            </div>
          ))}

          <div>
            <NewColumnForm bucketId={bucketId} onSuccess={scrollRight} />
          </div>
        </section>
      </div>
    </DocumentTitle>
  )
}
