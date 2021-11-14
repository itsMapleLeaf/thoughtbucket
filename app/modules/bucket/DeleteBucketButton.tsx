import { TrashIcon } from "@heroicons/react/solid"
import { Link } from "react-router-dom"
import type { LinkProps } from "remix"
import { Form } from "remix"
import { BackButton } from "~/modules/remix/BackButton"
import { FormSubmitButton } from "~/modules/remix/FormSubmitButton"
import { SearchParamModal } from "~/modules/remix/SearchParamModal"
import { fadedButtonClass, solidDangerButtonClass } from "../ui/button"
import { leftButtonIconClass } from "../ui/icon"
import { Modal } from "../ui/Modal"

export function DeleteBucketButton({
  bucket,
  ...props
}: Partial<LinkProps> & { bucket: { id: string; name: string } }) {
  return (
    <>
      <Link to={`?delete-bucket=${bucket.id}`} {...props} />
      <SearchParamModal title="delete bucket :(" paramName="delete-bucket">
        <Form action={`/buckets/${bucket.id}`} method="delete">
          <p className="mb-4">
            are you sure you want to delete the bucket &quot;
            <strong>{bucket.name}</strong>&quot;?
          </p>
          <div className={Modal.buttonGroupClass}>
            <BackButton className={fadedButtonClass}>cancel</BackButton>
            <FormSubmitButton
              data-testid="bucket-delete-confirm"
              className={solidDangerButtonClass}
            >
              <TrashIcon className={leftButtonIconClass} /> delete bucket
            </FormSubmitButton>
          </div>
        </Form>
      </SearchParamModal>
    </>
  )
}
