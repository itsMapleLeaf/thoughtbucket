import { PlusIcon } from "@heroicons/react/solid"
import React, { useState } from "react"
import { Button } from "../dom/Button"
import { fadedButtonClass } from "../ui/button"
import { inlineIconClass } from "../ui/icon"
import { textInputClass } from "../ui/input"

const Context = React.createContext<{
  value: string
  onChange: (value: string) => void
}>({
  value: "",
  onChange: () => {},
})

export function QuickInsertForm({
  onSubmit,
  children,
}: {
  onSubmit: (value: string) => void
  children: React.ReactNode
}) {
  const [value, setValue] = useState("")
  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        setValue("")
        onSubmit(value)
      }}
    >
      <Context.Provider value={{ value, onChange: setValue }}>
        {children}
      </Context.Provider>
    </form>
  )
}

QuickInsertForm.Input = function QuickInsertFormInput({
  name,
  placeholder,
  label,
}: {
  name?: string
  placeholder: string
  label: string
}) {
  const { value, onChange } = React.useContext(Context)
  return (
    <input
      type="text"
      name={name}
      aria-label={label}
      placeholder={placeholder}
      required
      className={textInputClass}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

QuickInsertForm.Button = function QuickInsertFormButton({
  title,
}: {
  title: string
}) {
  return (
    <Button type="submit" title={title} className={fadedButtonClass}>
      <PlusIcon className={inlineIconClass} />
    </Button>
  )
}
