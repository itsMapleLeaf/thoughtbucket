import { ViewGridAddIcon } from "@heroicons/react/solid"
import { Form } from "next-runtime/form"
import { useRouter } from "next/router"
import React from "react"
import type { ButtonProps } from "../dom/Button"
import { Button } from "../dom/Button"
import { fadedButtonClass, solidButtonClass } from "../ui/button"
import { leftButtonIconClass } from "../ui/icon"
import { Modal } from "../ui/Modal"
import { TextInputField } from "../ui/TextInputField"

export function CreateBucketButton(props: ButtonProps) {
  const router = useRouter()
  return (
    <Modal
      title="create a bucket!"
      renderTrigger={(triggerProps) => <Button {...triggerProps} {...props} />}
      renderContent={({ close }) => (
        <Form
          action="/buckets"
          method="post"
          onSuccess={(data: { newBucket?: { id?: string } }) => {
            close()
            if (data.newBucket?.id) {
              void router.push(`/buckets/${data.newBucket.id}`)
            }
          }}
        >
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
        </Form>
      )}
    />
  )
}
