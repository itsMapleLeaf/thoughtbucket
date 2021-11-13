import { useRef } from "react"
import { useStoreState } from "../state/Store"
import { ScrollingDndProvider } from "../ui/drag-and-drop"
import { QuickInsertForm } from "../ui/QuickInsertForm"
import { ColumnCard } from "./ColumnCard"
import type { ColumnEditorStore } from "./ColumnEditorStore"

export function ColumnEditor({ store }: { store: ColumnEditorStore }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const columns = useStoreState(store)

  return (
    <ScrollingDndProvider>
      <div
        className="grid grid-flow-col gap-4 p-4 auto-cols-max grid-rows-1 mx-auto min-w-[min(1024px,100%)] max-w-full overflow-auto h-full"
        ref={containerRef}
      >
        {columns.map((column, index) => (
          <ColumnCard
            key={column.id}
            column={column}
            index={index}
            store={store}
          />
        ))}

        <div className="w-72">
          <QuickInsertForm
            onSubmit={(name) => {
              store.addColumn(name)
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
