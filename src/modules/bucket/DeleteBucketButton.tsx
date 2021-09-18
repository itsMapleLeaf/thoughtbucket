import { TrashIcon } from "@heroicons/react/solid"
import { Form } from "next-runtime/form"
import type { ButtonProps } from "../dom/Button"
import { Button } from "../dom/Button"
import { usePendingFormNavigation } from "../routing/usePendingFormNavigation"
import { fadedButtonClass, solidDangerButtonClass } from "../ui/button"
import { leftButtonIconClass } from "../ui/icon"
import { Modal } from "../ui/Modal"

export function DeleteBucketButton({
  bucket,
  ...props
}: ButtonProps & { bucket: { id: string; name: string } }) {
  const pending = usePendingFormNavigation()

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
            <Button
              type="submit"
              className={solidDangerButtonClass}
              loading={pending}
            >
              <TrashIcon className={leftButtonIconClass} /> delete bucket
            </Button>
          </div>
        </Form>
      )}
    />
  )
}
