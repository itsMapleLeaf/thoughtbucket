import { useRef } from "react"
import { ScrollingDndProvider } from "../ui/drag-and-drop"
import { QuickInsertForm } from "../ui/QuickInsertForm"
import type { Column } from "./Column"
import {
  addColumnToList,
  createThoughtWithinColumn,
  moveThoughtBetweenColumns,
  removeColumnFromList,
  removeThoughtFromColumn,
} from "./Column"
import { ColumnCard } from "./ColumnCard"

export function ScrollingColumnList({
  columns,
  onChange,
}: {
  columns: Column[]
  onChange: (updateFn: (prev: Column[]) => Column[]) => void
}) {
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
            onDelete={() => onChange(removeColumnFromList(column.id))}
            onCreateThought={(text) => {
              onChange(createThoughtWithinColumn({ columnId: column.id, text }))
            }}
            onDeleteThought={(thoughtId) => {
              onChange(
                removeThoughtFromColumn({ columnId: column.id, thoughtId }),
              )
            }}
            onMoveThought={(args) => {
              onChange(moveThoughtBetweenColumns(args))
            }}
          />
        ))}

        <div>
          <QuickInsertForm
            onSubmit={(name) => {
              onChange(addColumnToList(name.trim()))
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
