import { PlusIcon } from "@heroicons/react/solid"
import type { FormEvent } from "react"
import React, { useState } from "react"
import { Form } from "remix"
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
  action,
  method,
  onSubmit,
  children,
}: {
  action?: string
  method?: "post" | "put" | "patch" | "delete"
  children: React.ReactNode
  onSubmit?: (value: string, event: FormEvent) => void
}) {
  const [value, setValue] = useState("")
  return (
    <Form
      className="flex gap-2"
      action={action}
      method={method}
      onSubmit={(event) => {
        onSubmit?.(value, event)
        setValue("")
      }}
    >
      <Context.Provider value={{ value, onChange: setValue }}>
        {children}
      </Context.Provider>
    </Form>
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
