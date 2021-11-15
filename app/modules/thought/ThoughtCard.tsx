import { CheckIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import React from "react"
import { InlineInputForm } from "~/modules/ui/InlineInputForm"
import type { ColumnEditorStore } from "../column/ColumnEditorStore"
import { Button } from "../dom/Button"
import { fadedButtonClass } from "../ui/button"
import { createDndHooks, DragPreview } from "../ui/drag-and-drop"
import { inlineIconClass } from "../ui/icon"

type ClientThought = {
  id: string
  text: string
}

export type ThoughtDragInfo = {
  index: number
  columnId: string
}

export const ThoughtDndHooks = createDndHooks<ThoughtDragInfo>({
  type: "thought",
})

export function ThoughtCard({
  thought,
  columnId,
  index,
  store,
}: {
  thought: ClientThought
  columnId: string
  index: number
  store: ColumnEditorStore
}) {
  const [dragState, dragRef] = ThoughtDndHooks.useDrag({
    item: { index, columnId },
  })

  const [dropState, dropRef] = ThoughtDndHooks.useDrop({
    onDrop: (info) => {
      store.moveThought({
        from: info,
        to: { index, columnId },
      })
    },
  })

  const [editing, setEditing] = React.useState(false)

  function submitEdit(newText: string) {
    setEditing(false)
    store.editThought(columnId, thought.id, newText)
  }

  return (
    <DragPreview state={dragState}>
      {({ isPreview }) => (
        <div
          className={clsx(
            "flex items-center bg-slate-700 border-l-4 border-indigo-400 rounded-sm shadow group",
            dropState.isOver && !isPreview && "opacity-50",

            // the card shrinks when dragging, so we need to set a width
            // but this also can't be too big,
            // otherwise it'll make all the other cards bigger
            isPreview && "w-60",
          )}
          ref={isPreview ? undefined : dropRef}
          data-testid="thought-card"
        >
          {editing ? (
            <div className="flex-1">
              <InlineInputForm
                initialValue={thought.text}
                textAreaClass="block w-full p-2 transition bg-transparent resize-none hover:bg-black/30 focus:bg-black/30 focus:outline-none"
                onSubmit={(newText) => {
                  setEditing(false)
                  store.editThought(columnId, thought.id, newText)
                }}
              />
            </div>
          ) : (
            <p
              className="flex-1 flex items-center p-2 cursor-[grab] self-stretch"
              ref={dragRef}
            >
              {thought.text}
            </p>
          )}

          <div className="grid w-8 min-h-[4rem] grid-rows-[2rem,2rem] transition-opacity opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
            {editing ? (
              <Button
                className={fadedButtonClass}
                title="save thought"
                onClick={() => setEditing(false)}
              >
                <CheckIcon className={inlineIconClass} />
              </Button>
            ) : (
              <Button
                className={fadedButtonClass}
                title="edit thought"
                onClick={() => setEditing(true)}
              >
                <PencilAltIcon className={inlineIconClass} />
              </Button>
            )}
            <Button
              className={fadedButtonClass}
              title="delete thought"
              onClick={() => store.removeThought(columnId, thought.id)}
            >
              <TrashIcon className={inlineIconClass} />
            </Button>
          </div>
        </div>
      )}
    </DragPreview>
  )
}
