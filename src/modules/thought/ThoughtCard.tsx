import { CheckIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import type { ReactNode } from "react"
import React, { useEffect } from "react"
import { useDrag, useDrop } from "react-dnd"
import ReactDOM from "react-dom"
import TextArea from "react-expanding-textarea"
import mergeRefs from "react-merge-refs"
import { withPreventDefault } from "../../helpers"
import type { ButtonProps } from "../dom/Button"
import { Button } from "../dom/Button"
import { fadedButtonClass } from "../ui/button"
import { inlineIconClass } from "../ui/icon"

type ClientThought = {
  id: string
  text: string
}

export type ThoughtDragInfo = {
  index: number
  columnId: string
}

export function ThoughtCard({
  thought,
  column,
  index,
  onDelete,
  onDrop,
}: {
  thought: ClientThought
  column: { id: string }
  index: number
  onDelete: () => void
  onDrop: (info: ThoughtDragInfo) => void
}) {
  const [dragState, dragRef] = useDrag({
    type: "thought",
    item: (): ThoughtDragInfo => ({ index, columnId: column.id }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      elementOffset: monitor.getInitialSourceClientOffset(),
      mousePosition: monitor.getDifferenceFromInitialOffset(),
    }),
  })

  const [dropState, dropRef] = useDrop({
    accept: "thought",
    drop: (info: ThoughtDragInfo) => {
      if (dragState.isDragging) return
      onDrop(info)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const [editing, setEditing] = React.useState(false)
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (editing) textAreaRef.current!.focus()
  }, [editing])

  const card = (
    <div
      className={clsx(
        "flex items-center bg-gray-700 border-l-4 border-indigo-400 rounded-sm shadow group cursor-[grab]",
        dropState.isOver && "opacity-75",
      )}
      ref={mergeRefs([dragRef, dropRef])}
      data-testid="thought-card"
    >
      {editing ? (
        <form className="flex-1" onSubmit={withPreventDefault(() => {})}>
          <TextArea
            className="block w-full p-2 transition bg-transparent resize-none hover:bg-black/30 focus:bg-black/30 focus:outline-none"
            defaultValue={thought.text}
            ref={textAreaRef}
            onKeyDown={(event) => {
              if (event.key === "Enter" && event.ctrlKey) {
                event.preventDefault()
                setEditing(false)
              }
            }}
          />
          <Button type="submit" hidden>
            save
          </Button>
        </form>
      ) : (
        <p className="flex-1 p-2">{thought.text}</p>
      )}

      <div className="grid w-8 min-h-[4rem] grid-rows-[2rem,2rem] transition-opacity opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
        <Button
          className={fadedButtonClass}
          title={editing ? "save" : "edit thought"}
          onClick={() => setEditing((e) => !e)}
        >
          {editing ? (
            <CheckIcon className={inlineIconClass} />
          ) : (
            <PencilAltIcon className={inlineIconClass} />
          )}
        </Button>
        <DeleteThoughtButton
          className={fadedButtonClass}
          title="delete thought"
          onClick={onDelete}
        >
          <TrashIcon className={inlineIconClass} />
        </DeleteThoughtButton>
      </div>
    </div>
  )

  if (
    !dragState.isDragging ||
    !dragState.elementOffset ||
    !dragState.mousePosition
  )
    return card

  const x = dragState.elementOffset.x + dragState.mousePosition.x
  const y = dragState.elementOffset.y + dragState.mousePosition.y
  return (
    <>
      <div className="rounded-sm bg-black/20">
        <div className="opacity-0">{card}</div>
      </div>
      <Portal>
        <div
          className="fixed top-0 left-0 w-64 pointer-events-none"
          style={{
            transform: `translate(${x}px, ${y}px) rotate(-5deg)`,
          }}
        >
          {card}
        </div>
      </Portal>
    </>
  )
}

function DeleteThoughtButton(props: ButtonProps) {
  return <Button {...props} />
}

function Portal(props: { children: ReactNode }) {
  const elementRef = React.useRef<HTMLElement>()

  if (!elementRef.current && typeof window !== "undefined") {
    elementRef.current = document.createElement("react-portal")
    document.body.append(elementRef.current)
  }

  useEffect(() => {
    const element = elementRef.current
    return () => {
      element?.remove()
    }
  }, [])

  return elementRef.current ? (
    ReactDOM.createPortal(props.children, elementRef.current)
  ) : (
    <>{props.children}</>
  )
}
