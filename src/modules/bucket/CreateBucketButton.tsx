import { Dialog } from "@headlessui/react"
import { ViewGridAddIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import { useState } from "react"
import { Button, ButtonProps } from "../dom/Button"
import { fadedButtonClass, solidButtonClass } from "../ui/button"
import { cardClass } from "../ui/card"
import { leftButtonIconClass } from "../ui/icon"
import { TextInputField } from "../ui/TextInputField"

export function CreateBucketButton({ ...props }: ButtonProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button {...props} onClick={() => setOpen(true)} />

      <Dialog open={open} onClose={setOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <div className="fixed inset-0 flex flex-col pointer-events-none">
          <div
            className={clsx(
              cardClass,
              "m-auto w-full max-w-md p-4 grid gap-4 pointer-events-auto",
            )}
          >
            <Dialog.Title className="text-2xl font-light">
              create a bucket!
            </Dialog.Title>

            <form
              action="/api/buckets/create"
              method="post"
              className="contents"
            >
              <TextInputField
                label="bucket name"
                name="name"
                placeholder="my awesome bucket"
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  className={fadedButtonClass}
                  onClick={() => setOpen(false)}
                >
                  cancel
                </Button>
                <Button type="submit" className={solidButtonClass}>
                  <ViewGridAddIcon className={leftButtonIconClass} /> create
                  bucket
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  )
}
