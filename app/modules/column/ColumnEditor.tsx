import { useEffect, useRef } from "react"
import { useTransition } from "remix"
import { CreateColumnForm } from "~/modules/column/CreateColumnForm"
import { ScrollingDndProvider } from "../ui/drag-and-drop"
import { QuickInsertForm } from "../ui/QuickInsertForm"
import type { ColumnCardColumn } from "./ColumnCard"
import { ColumnCard } from "./ColumnCard"

export type ColumnEditorProps = {
  bucket: {
    id: string
    columns: ColumnCardColumn[]
  }
}

export function ColumnEditor({ bucket }: ColumnEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const transition = useTransition()
  const scrollOnIdle = useRef<boolean>(false)

  //#region here be demons, we can probably simplify this later
  useEffect(() => {
    if (
      transition.submission?.method === "POST" &&
      transition.submission?.action === "/columns" &&
      transition.type === "actionRedirect"
    ) {
      scrollOnIdle.current = true
    }
  }, [
    transition.submission?.action,
    transition.submission?.method,
    transition.type,
  ])

  useEffect(() => {
    if (transition.type === "idle" && scrollOnIdle.current) {
      scrollOnIdle.current = false
      requestAnimationFrame(() => {
        containerRef.current?.scrollTo({
          left: containerRef.current?.scrollWidth,
          behavior: "smooth",
        })
      })
    }
  }, [transition.type])
  //#endregion

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
          <QuickInsertForm action="/columns" method="post">
            <CreateColumnForm.Field
              as={QuickInsertForm.Input}
              name="name"
              placeholder="add a new column..."
              label="column name"
            />
            <CreateColumnForm.Field
              hidden
              readOnly
              name="bucketId"
              value={bucket.id}
            />
            <QuickInsertForm.Button title="add column" />
          </QuickInsertForm>
        </div>
      </div>
    </ScrollingDndProvider>
  )
}
