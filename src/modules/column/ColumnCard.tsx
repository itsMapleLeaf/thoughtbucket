import { TrashIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import React from "react"
import { useDrop } from "react-dnd"
import { Button } from "../dom/Button"
import type { ThoughtDragInfo } from "../thought/ThoughtCard"
import { ThoughtCard } from "../thought/ThoughtCard"
import { fadedButtonClass } from "../ui/button"
import { cardClass } from "../ui/card"
import { Draggable } from "../ui/drag-and-drop"
import { leftButtonIconClass } from "../ui/icon"
import { QuickInsertForm } from "../ui/QuickInsertForm"
import type { Column, MoveThoughtArgs } from "./Column"

export function ColumnCard({
  column,
  titleRef,
  onDelete,
  onCreateThought,
  onDeleteThought,
  onMoveThought,
  onDropColumn,
}: {
  column: Column
  titleRef: React.Ref<HTMLHeadingElement>
  onDelete: () => void
  onCreateThought: (text: string) => void
  onDeleteThought: (id: string) => void
  onMoveThought: (args: MoveThoughtArgs) => void
  onDropColumn: (otherIndex: number) => void
}) {
  const [thoughtDropState, thoughtDropRef] = useDrop({
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

  const [columnDropState, columnDropRef] = useDrop({
    accept: "column",
    drop: (info: { index: number }, monitor) => {
      if (monitor.didDrop()) return
      onDropColumn(info.index)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return (
    <section
      className={clsx(
        cardClass,
        "flex flex-col h-full",
        columnDropState.isOver && "opacity-50",
      )}
      data-testid="column-card"
      ref={columnDropRef}
    >
      <div className="flex items-start">
        <h3
          className="flex-1 p-3 text-lg font-light leading-tight cursor-[grab] "
          ref={titleRef}
        >
          {column.name}
        </h3>
        <div className="p-3">
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
            <Draggable
              key={thought.id}
              type="thought"
              item={{ index, columnId: column.id }}
            >
              {({ ref, isDragging }) => (
                <div className={isDragging ? "w-64" : ""}>
                  <ThoughtCard
                    dragHandleRef={ref}
                    thought={thought}
                    onDelete={() => onDeleteThought(thought.id)}
                    onDrop={(info) => {
                      onMoveThought({
                        from: info,
                        to: { columnId: column.id, index },
                      })
                    }}
                  />
                </div>
              )}
            </Draggable>
          ))}
        </div>
      </div>
    </section>
  )
}
