import { TrashIcon } from "@heroicons/react/solid"
import produce from "immer"
import { nanoid } from "nanoid"
import { useRef } from "react"
import type { BucketColumn } from "../column/BucketColumn"
import { ColumnCard } from "../column/ColumnCard"
import { Button } from "../dom/Button"
import { ThoughtCard } from "../thought/ThoughtCard"
import { fadedButtonClass } from "../ui/button"
import { leftButtonIconClass } from "../ui/icon"
import { QuickInsertForm } from "../ui/QuickInsertForm"

export function BucketPageColumns({
  columns,
  onChange,
}: {
  columns: BucketColumn[]
  onChange: (columns: BucketColumn[]) => void
}) {
  const createColumn = (name: string) =>
    onChange([...columns, { id: nanoid(), name, thoughts: [] }])

  const deleteColumn = (id: string) =>
    onChange(columns.filter((c) => c.id !== id))

  const createThought = (args: { columnId: string; text: string }) =>
    onChange(
      produce(columns, (draft) => {
        const column = draft.find((c) => c.id === args.columnId)
        column?.thoughts.unshift({ id: nanoid(), text: args.text })
      }),
    )

  const deleteThought = (args: { columnId: string; thoughtId: string }) =>
    onChange(
      produce(columns, (draft) => {
        const column = draft.find((c) => c.id === args.columnId)
        if (column) {
          column.thoughts = column.thoughts.filter(
            (t) => t.id !== args.thoughtId,
          )
        }
      }),
    )

  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="grid grid-flow-col gap-4 p-4 auto-cols-[18rem] grid-rows-1 mx-auto min-w-[min(1024px,100%)] max-w-full overflow-auto h-full"
      ref={containerRef}
    >
      {columns.map((column) => (
        <ColumnCard key={column.id}>
          <ColumnCard.Header
            title={column.name}
            right={
              <Button
                className={fadedButtonClass}
                title="delete this column"
                onClick={() => deleteColumn(column.id)}
              >
                <TrashIcon className={leftButtonIconClass} />
              </Button>
            }
          />

          <div className={ColumnCard.sectionClass}>
            <QuickInsertForm
              onSubmit={(text) => createThought({ columnId: column.id, text })}
            >
              <QuickInsertForm.Input
                placeholder="add a new thought..."
                label="thought text"
              />
              <QuickInsertForm.Button title="add thought" />
            </QuickInsertForm>
          </div>

          <ul className={ColumnCard.listClass}>
            {column.thoughts.map((thought, index) => (
              <li key={thought.id}>
                <ThoughtCard
                  thought={thought}
                  onDelete={() =>
                    deleteThought({
                      columnId: column.id,
                      thoughtId: thought.id,
                    })
                  }
                />
              </li>
            ))}
          </ul>
        </ColumnCard>
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
  )
}
