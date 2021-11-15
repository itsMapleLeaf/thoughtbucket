import { useState } from "react"
import TextArea from "react-expanding-textarea"
import { withPreventDefault } from "~/modules/common/withPreventDefault"
import { Button } from "~/modules/dom/Button"
import { useMountFocus } from "~/modules/dom/useMountFocus"
import { textInputClass } from "~/modules/ui/input"

export function InlineInputForm({
  initialValue,
  textAreaClass = textInputClass,
  onSubmit,
}: {
  initialValue: string
  textAreaClass?: string
  onSubmit: (value: string) => void
}) {
  const [value, setValue] = useState(initialValue)
  const ref = useMountFocus()

  return (
    <form onSubmit={withPreventDefault(() => onSubmit(value))}>
      <TextArea
        aria-label="text"
        className={textAreaClass}
        ref={ref}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.ctrlKey || event.shiftKey)) {
            event.preventDefault()
            onSubmit(value)
          }
        }}
        onBlur={() => onSubmit(value)}
      />
      <Button type="submit" className="sr-only">
        save
      </Button>
    </form>
  )
}
