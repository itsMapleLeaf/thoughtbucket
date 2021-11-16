import type { DataFunctionArgs } from "@remix-run/server-runtime"
import clsx from "clsx"
import { requireUserOrError } from "~/modules/auth/requireUserOrError"
import { requireUserOrRedirect } from "~/modules/auth/requireUserOrRedirect"
import { BucketSummaryCard } from "~/modules/bucket/BucketSummaryCard"
import { CreateBucketForm } from "~/modules/bucket/CreateBucketForm"
import { serialize } from "~/modules/common/serialize"
import { getClient } from "~/modules/db"
import { catchErrorResponse } from "~/modules/remix/catchErrorResponse"
import {
  jsonTyped,
  redirectTyped,
  useLoaderDataTyped,
} from "~/modules/remix/data"
import { handleMethods } from "~/modules/remix/handleMethods"
import { containerClass } from "~/modules/ui/container"

export async function loader({ request }: DataFunctionArgs) {
  const user = await requireUserOrRedirect(request)

  const buckets = await getClient().bucket.findMany({
    where: {
      ownerId: user.id,
    },
    select: {
      id: true,
      name: true,
    },
  })

  return jsonTyped(serialize({ buckets }))
}

export async function action({ request }: DataFunctionArgs) {
  return catchErrorResponse(async () => {
    return handleMethods(request, {
      async post() {
        const body = await CreateBucketForm.getBody(request)
        const user = await requireUserOrError(request)

        const bucket = await getClient().bucket.create({
          data: {
            name: body.name,
            ownerId: user.id,
          },
          select: {
            id: true,
          },
        })

        return redirectTyped(`/buckets/${bucket.id}`, 303)
      },
    })
  })
}

export default function BucketListPage() {
  const { buckets } = useLoaderDataTyped<typeof loader>()
  return (
    <div
      className={clsx(
        containerClass,
        "grid gap-4 grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]",
      )}
    >
      {buckets.map((bucket) => (
        <BucketSummaryCard key={bucket.id} bucket={bucket} />
      ))}
    </div>
  )
}
