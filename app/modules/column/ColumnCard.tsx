import { CheckIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import React from "react"
import { InlineInputForm } from "~/modules/ui/InlineInputForm"
import { Button } from "../dom/Button"
import { ThoughtCard, ThoughtDndHooks } from "../thought/ThoughtCard"
import { fadedButtonClass } from "../ui/button"
import { cardClass } from "../ui/card"
import { createDndHooks, DragPreview } from "../ui/drag-and-drop"
import { inlineIconClass } from "../ui/icon"
import { QuickInsertForm } from "../ui/QuickInsertForm"
import type { Column } from "./Column"
import type { ColumnEditorStore } from "./ColumnEditorStore"

const ColumnDndHooks = createDndHooks<{
  index: number
}>({ type: "column" })

export function ColumnCard({
  column,
  index,
  store,
}: {
  column: Column
  index: number
  store: ColumnEditorStore
}) {
  const [thoughtDropState, thoughtDropRef] = ThoughtDndHooks.useDrop({
    onDrop(info) {
      store.moveThought({
        from: info,
        to: { columnId: column.id, index: column.thoughts.length },
      })
    },
  })

  const [columnDropState, columnDropRef] = ColumnDndHooks.useDrop({
    onDrop: (info) => {
      store.moveColumn(info.index, index)
    },
  })

  const [columnDragState, columnDragRef] = ColumnDndHooks.useDrag({
    item: { index },
  })

  const [editing, setEditing] = React.useState(false)

  return (
    <DragPreview state={columnDragState}>
      {() => (
        <section
          className={clsx(
            cardClass,
            "flex flex-col h-full w-72",
            columnDropState.isOver && "opacity-50",
          )}
          data-testid="column-card"
          ref={columnDropRef}
        >
          <div className="flex items-start">
            {editing ? (
              <div className="flex-1 p-3 pr-0">
                <InlineInputForm
                  initialValue={column.name}
                  onSubmit={(name) => {
                    setEditing(false)
                    store.renameColumn(column.id, name)
                  }}
                />
              </div>
            ) : (
              <h3
                className="flex-1 p-3 text-lg font-light leading-tight cursor-[grab]"
                ref={columnDragRef}
              >
                {column.name}
              </h3>
            )}
            <div className="flex gap-3 p-3">
              {editing ? (
                <Button
                  className={fadedButtonClass}
                  title="save column name"
                  onClick={() => setEditing(false)}
                >
                  <CheckIcon className={inlineIconClass} />
                </Button>
              ) : (
                <Button
                  title="edit this column"
                  className={fadedButtonClass}
                  onClick={() => setEditing(true)}
                >
                  <PencilAltIcon className={inlineIconClass} />
                </Button>
              )}

              <Button
                title="delete this column"
                className={fadedButtonClass}
                onClick={() => store.removeColumn(column.id)}
              >
                <TrashIcon className={inlineIconClass} />
              </Button>
            </div>
          </div>

          <div className="px-3 pb-3">
            <QuickInsertForm
              onSubmit={(text) => store.addThought(column.id, text)}
            >
              <QuickInsertForm.Input
                placeholder="add a new thought..."
                label="thought text"
              />
              <QuickInsertForm.Button title="add thought" />
            </QuickInsertForm>
          </div>

          <div
            className="flex-1 min-h-0 px-3 pb-3 overflow-y-auto transform-gpu"
            ref={thoughtDropRef}
          >
            <div
              className={clsx(
                "grid items-start content-start gap-3 h-full rounded",
                thoughtDropState.isOver && "bg-black/20",
              )}
            >
              {column.thoughts.map((thought, index) => (
                <ThoughtCard
                  key={thought.id}
                  thought={thought}
                  columnId={column.id}
                  index={index}
                  store={store}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </DragPreview>
  )
}
