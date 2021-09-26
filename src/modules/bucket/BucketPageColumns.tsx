import produce from "immer"
import { nanoid } from "nanoid"
import { useRef } from "react"
import type { BucketColumn } from "../column/BucketColumn"
import { ColumnCard } from "../column/ColumnCard"
import { ScrollingDndProvider } from "../ui/drag-and-drop"
import { QuickInsertForm } from "../ui/QuickInsertForm"

export function BucketPageColumns({
  columns,
  onChange,
}: {
  columns: BucketColumn[]
  onChange: (updateFn: (prev: BucketColumn[]) => BucketColumn[]) => void
}) {
  const createColumn = (name: string) =>
    onChange((columns) => [...columns, { id: nanoid(), name, thoughts: [] }])

  const deleteColumn = (id: string) =>
    onChange((columns) => columns.filter((c) => c.id !== id))

  const createThought = (args: { columnId: string; text: string }) =>
    onChange(
      produce((draft) => {
        const column = draft.find((c) => c.id === args.columnId)
        column?.thoughts.unshift({ id: nanoid(), text: args.text })
      }),
    )

  const deleteThought = (args: { columnId: string; thoughtId: string }) =>
    onChange(
      produce((draft) => {
        const column = draft.find((c) => c.id === args.columnId)
        if (column) {
          column.thoughts = column.thoughts.filter(
            (t) => t.id !== args.thoughtId,
          )
        }
      }),
    )

  const moveThought = (args: {
    from: {
      columnId: string
      index: number
    }
    to: {
      columnId: string
      index: number
    }
  }) => {
    if (
      args.from.columnId === args.to.columnId &&
      args.from.index === args.to.index
    )
      return

    onChange(
      produce((draft) => {
        const fromColumn = draft.find((c) => c.id === args.from.columnId)
        const toColumn = draft.find((c) => c.id === args.to.columnId)
        if (!fromColumn || !toColumn) return

        const removed = fromColumn.thoughts.splice(args.from.index, 1)
        toColumn.thoughts.splice(args.to.index, 0, ...removed)
      }),
    )
  }

  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <ScrollingDndProvider>
      <div
        className="grid grid-flow-col gap-4 p-4 auto-cols-[18rem] grid-rows-1 mx-auto min-w-[min(1024px,100%)] max-w-full overflow-auto h-full"
        ref={containerRef}
      >
        {columns.map((column) => (
          <ColumnCard
            key={column.id}
            column={column}
            onDelete={() => deleteColumn(column.id)}
            onCreateThought={(text) => {
              createThought({ columnId: column.id, text })
            }}
            onDeleteThought={(thoughtId) => {
              deleteThought({ columnId: column.id, thoughtId })
            }}
            onMoveThought={moveThought}
          />
        ))}

        <div>
          <QuickInsertForm
            onSubmit={(name) => {
              createColumn(name.trim())
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
