import { TrashIcon } from "@heroicons/react/solid"
import { Form } from "remix"
import { FormSubmitButton } from "~/modules/remix/FormSubmitButton"
import type { ButtonProps } from "../dom/Button"
import { Button } from "../dom/Button"
import { fadedButtonClass, solidDangerButtonClass } from "../ui/button"
import { leftButtonIconClass } from "../ui/icon"
import { Modal } from "../ui/Modal"

export function DeleteBucketButton({
  bucket,
  ...props
}: ButtonProps & { bucket: { id: string; name: string } }) {
  return (
    <Modal
      title="delete bucket :("
      renderTrigger={(triggerProps) => <Button {...triggerProps} {...props} />}
      renderContent={({ close }) => (
        <Form
          action={`/buckets/${bucket.id}`}
          method="delete"
          className="grid gap-4"
        >
          <p>
            are you sure you want to delete the bucket &quot;
            <strong>{bucket.name}</strong>&quot;?
          </p>
          <div className={Modal.buttonGroupClass}>
            <Button className={fadedButtonClass} onClick={close}>
              cancel
            </Button>
            <FormSubmitButton className={solidDangerButtonClass}>
              <TrashIcon className={leftButtonIconClass} /> delete bucket
            </FormSubmitButton>
          </div>
        </Form>
      )}
    />
  )
}
