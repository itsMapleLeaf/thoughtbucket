import { CheckIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/solid"
import React, { useEffect } from "react"
import TextArea from "react-expanding-textarea"
import { withPreventDefault } from "../../helpers"
import type { ButtonProps } from "../dom/Button"
import { Button } from "../dom/Button"
import { fadedButtonClass } from "../ui/button"
import { inlineIconClass } from "../ui/icon"

export function ThoughtCard({
  thought,
  onDelete,
}: {
  thought: { text: string }
  onDelete: () => void
}) {
  const [editing, setEditing] = React.useState(false)
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) textAreaRef.current?.focus()
  }, [editing])

  return (
    <div className="flex items-center bg-gray-700 border-l-4 border-indigo-400 rounded-sm shadow group">
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
}

function DeleteThoughtButton(props: ButtonProps) {
  return <Button {...props} />
}
