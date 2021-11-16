import { useRef } from "react"
import type { ClientBucket } from "~/modules/bucket/ClientBucket"
import { useUpdateBucketFetcher } from "~/modules/bucket/UpdateBucket"
import { ScrollingDndProvider } from "../ui/drag-and-drop"
import { QuickInsertForm } from "../ui/QuickInsertForm"
import { ColumnCard } from "./ColumnCard"

export function ColumnEditor({ bucket }: { bucket: ClientBucket }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const fetcher = useUpdateBucketFetcher(bucket.id)

  return (
    <ScrollingDndProvider>
      <div
        className="grid grid-flow-col gap-4 p-4 auto-cols-max grid-rows-1 mx-auto min-w-[min(1024px,100%)] max-w-full overflow-auto h-full"
        ref={containerRef}
      >
        {bucket.columns.map((column, index) => (
          <ColumnCard key={column.id} column={column} index={index} />
        ))}

        <div className="w-72">
          <QuickInsertForm
            onSubmit={(name) => {
              fetcher.submit({ createColumnName: name })
              requestAnimationFrame(() => {
                containerRef.current?.scrollTo({
                  left: 0,
                  behavior: "smooth",
                })
              })
            }}
          >
            <QuickInsertForm.Input
              name="createColumn.name"
              placeholder="add a new column..."
              label="column name"
            />
            <QuickInsertForm.Button title="add column" />
          </QuickInsertForm>
        </div>
      </div>
    </ScrollingDndProvider>
  )
}
