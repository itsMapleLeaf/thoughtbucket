import type { LinkProps } from "remix"
import { Form, Link } from "remix"
import { FormSubmitButton } from "~/modules/remix/FormSubmitButton"
import { BackButton } from "../remix/BackButton"
import { SearchParamModal } from "../remix/SearchParamModal"
import { fadedButtonClass, solidButtonClass } from "../ui/button"
import { Modal } from "../ui/Modal"
import { TextInputField } from "../ui/TextInputField"

export function EditBucketButton({
  bucket,
  ...props
}: Partial<LinkProps> & { bucket: { id: string; name: string } }) {
  return (
    <>
      <Link {...props} to="?edit-bucket" />
      <SearchParamModal title="edit bucket" paramName="edit-bucket">
        <Form
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
          />
          {/* {error && <p>Error: {error.message}</p>} */}
          <div className={Modal.buttonGroupClass}>
            <BackButton className={fadedButtonClass}>cancel</BackButton>
            <FormSubmitButton className={solidButtonClass}>
              submit
            </FormSubmitButton>
          </div>
        </Form>
      </SearchParamModal>
    </>
  )
}
