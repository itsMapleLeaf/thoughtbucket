import { ViewGridAddIcon } from "@heroicons/react/solid"
import { Button, ButtonProps } from "../dom/Button"
import { fadedButtonClass, solidButtonClass } from "../ui/button"
import { leftButtonIconClass } from "../ui/icon"
import { Modal } from "../ui/Modal"
import { TextInputField } from "../ui/TextInputField"

export function CreateBucketButton(props: ButtonProps) {
  return (
    <Modal
      title="create a bucket!"
      renderTrigger={(triggerProps) => <Button {...triggerProps} {...props} />}
      renderContent={({ close }) => (
        <form action="/buckets" method="post">
          <TextInputField
            label="bucket name"
            name="name"
            placeholder="my awesome bucket"
          />
          <div className="flex justify-end gap-4 mt-4">
            <Button type="button" className={fadedButtonClass} onClick={close}>
              cancel
            </Button>
            <Button type="submit" className={solidButtonClass}>
              <ViewGridAddIcon className={leftButtonIconClass} /> create bucket
            </Button>
          </div>
        </form>
      )}
    />
  )
}
