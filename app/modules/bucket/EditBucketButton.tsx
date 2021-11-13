import { nanoid } from "nanoid"
import { Form, useFormSubmit } from "next-runtime/form"
import { useEffect, useRef, useState } from "react"
import type { ButtonProps } from "../dom/Button"
import { Button } from "../dom/Button"
import { fadedButtonClass, solidButtonClass } from "../ui/button"
import { Modal } from "../ui/Modal"
import { TextInputField } from "../ui/TextInputField"

export function EditBucketButton({
  bucket,
  ...props
}: ButtonProps & { bucket: { id: string; name: string } }) {
  return (
    <Modal
      title="edit bucket"
      renderTrigger={(triggerProps) => <Button {...triggerProps} {...props} />}
      renderContent={({ close }) => (
        <EditBucketForm bucket={bucket} onSuccess={close} />
      )}
    />
  )
}

function EditBucketForm({
  bucket,
  onSuccess,
}: {
  bucket: { id: string; name: string }
  onSuccess: () => void
}) {
  // create a unique form name to reset isSuccess state
  // https://github.com/smeijer/next-runtime/issues/31
  const [formName] = useState(`edit-bucket-${nanoid()}`)
  const { error, isLoading, isSuccess } = useFormSubmit(formName)
  useEffect(() => {
    if (isSuccess) onSuccess()
  }, [isSuccess, onSuccess])

  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  return (
    <Form
      name={formName}
      action={`/buckets/${bucket.id}`}
      method="patch"
      className="grid gap-4"
      data-testid="edit-bucket-form"
    >
      <TextInputField
        name="name"
        label="name"
        defaultValue={bucket.name}
        required
        inputRef={inputRef}
      />
      {error && <p>Error: {error.message}</p>}
      <div className={Modal.buttonGroupClass}>
        <Button className={fadedButtonClass} onClick={close}>
          cancel
        </Button>
        <Button type="submit" className={solidButtonClass} loading={isLoading}>
          submit
        </Button>
      </div>
    </Form>
  )
}
