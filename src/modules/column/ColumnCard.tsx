import { TrashIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import React from "react"
import { useDrop } from "react-dnd"
import { Button } from "../dom/Button"
import type { ThoughtDragInfo } from "../thought/ThoughtCard"
import { ThoughtCard } from "../thought/ThoughtCard"
import { fadedButtonClass } from "../ui/button"
import { cardClass } from "../ui/card"
import { leftButtonIconClass } from "../ui/icon"
import { QuickInsertForm } from "../ui/QuickInsertForm"
import type { Column, MoveThoughtArgs } from "./Column"

export function ColumnCard({
  column,
  onDelete,
  onCreateThought,
  onDeleteThought,
  onMoveThought,
}: {
  column: Column
  onDelete: () => void
  onCreateThought: (text: string) => void
  onDeleteThought: (id: string) => void
  onMoveThought: (args: MoveThoughtArgs) => void
}) {
  const [dropState, dropRef] = useDrop({
    accept: "thought",
    drop: (info: ThoughtDragInfo, monitor) => {
      if (monitor.didDrop()) return
      onMoveThought({
        from: info,
        to: { columnId: column.id, index: column.thoughts.length },
      })
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  })

  return (
    <section
      className={clsx(
        cardClass,
        "flex flex-col",
        dropState.isOver && "opacity-75",
      )}
      data-testid="column-card"
    >
      <div className="flex items-start gap-3 p-3">
        <h3 className="text-lg font-light leading-tight">{column.name}</h3>
        <div className="ml-auto">
          <Button
            className={fadedButtonClass}
            title="delete this column"
            onClick={onDelete}
          >
            <TrashIcon className={leftButtonIconClass} />
          </Button>
        </div>
      </div>

      <div className="px-3 pb-3">
        <QuickInsertForm onSubmit={onCreateThought}>
          <QuickInsertForm.Input
            placeholder="add a new thought..."
            label="thought text"
          />
          <QuickInsertForm.Button title="add thought" />
        </QuickInsertForm>
      </div>

      <div
        className="grid items-start content-start flex-1 min-h-0 gap-3 px-3 pb-3 overflow-y-auto transform-gpu"
        ref={dropRef}
      >
        {column.thoughts.map((thought, index) => (
          <ThoughtCard
            key={thought.id}
            thought={thought}
            column={column}
            index={index}
            onDelete={() => onDeleteThought(thought.id)}
            onDrop={(info) => {
              onMoveThought({
                from: info,
                to: { columnId: column.id, index },
              })
            }}
          />
        ))}
      </div>
    </section>
  )
}
