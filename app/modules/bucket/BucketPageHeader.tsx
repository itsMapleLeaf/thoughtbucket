import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid"
import { fadedButtonClass } from "../ui/button"
import { containerClass } from "../ui/container"
import { leftButtonIconClass } from "../ui/icon"
import { BucketPageSummary } from "./BucketPageSummary"
import { DeleteBucketButton } from "./DeleteBucketButton"
import { EditBucketButton } from "./EditBucketButton"

export function BucketPageHeader({
  bucket,
}: {
  bucket: { id: string; name: string; createdAt: string }
}) {
  return (
    <section
      className={`${containerClass} flex flex-wrap items-baseline gap-x-4 gap-y-2`}
    >
      <div className="mr-auto">
        <BucketPageSummary {...bucket} />
      </div>

      <div className="flex gap-4">
        <EditBucketButton bucket={bucket} className={fadedButtonClass}>
          <PencilAltIcon className={leftButtonIconClass} /> rename
        </EditBucketButton>
        <DeleteBucketButton
          bucket={bucket}
          className={fadedButtonClass}
          data-testid="bucket-page-delete"
        >
          <TrashIcon className={leftButtonIconClass} /> delete
        </DeleteBucketButton>
      </div>
    </section>
  )
}
