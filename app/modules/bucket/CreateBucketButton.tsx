import { ViewGridAddIcon } from "@heroicons/react/solid"
import { Link } from "react-router-dom"
import type { LinkProps } from "remix"
import { Form } from "remix"
import { CreateBucketForm } from "~/modules/bucket/forms"
import { BackButton } from "~/modules/remix/BackButton"
import { FormSubmitButton } from "~/modules/remix/FormSubmitButton"
import { SearchParamModal } from "~/modules/remix/SearchParamModal"
import { Modal } from "~/modules/ui/Modal"
import { fadedButtonClass, solidButtonClass } from "../ui/button"
import { leftButtonIconClass } from "../ui/icon"
import { TextInputField } from "../ui/TextInputField"

export function CreateBucketButton(props: Partial<LinkProps>) {
  return (
    <>
      <Link to="?create-bucket" {...props} />
      <SearchParamModal title="create a bucket!" paramName="create-bucket">
        <Form action="/buckets" method="post">
          <CreateBucketForm.Field
            as={TextInputField}
            label="bucket name"
            name="name"
            placeholder="my awesome bucket"
            data-testid="create-bucket-name"
            required
          />
          <div className={Modal.buttonGroupClass}>
            <BackButton className={fadedButtonClass}>cancel</BackButton>
            <FormSubmitButton className={solidButtonClass}>
              <ViewGridAddIcon className={leftButtonIconClass} /> create bucket
            </FormSubmitButton>
          </div>
        </Form>
      </SearchParamModal>
    </>
  )
}
