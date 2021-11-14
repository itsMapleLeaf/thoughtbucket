import type { DataFunctionArgs } from "@remix-run/server-runtime"
import clsx from "clsx"
import { AppLayout } from "~/modules/app/AppLayout"
import { sessionHelpers } from "~/modules/auth/session"
import { BucketSummaryCard } from "~/modules/bucket/BucketSummaryCard"
import { CreateBucketForm } from "~/modules/bucket/forms"
import { pick } from "~/modules/common/helpers"
import { serialize } from "~/modules/common/serialize"
import { getClient } from "~/modules/db"
import { httpCodes } from "~/modules/network/http-codes"
import {
  jsonTyped,
  redirectTyped,
  useLoaderDataTyped,
} from "~/modules/remix/data"
import { errorResponse } from "~/modules/remix/error-response"
import { handleMethods } from "~/modules/remix/handleMethods"
import { containerClass } from "~/modules/ui/container"

export async function loader({ request }: DataFunctionArgs) {
  const user = await sessionHelpers(request).getUser()
  if (!user) return redirectTyped("/login")

  const buckets = await getClient().bucket.findMany({
    where: {
      ownerId: user.id,
    },
    select: {
      id: true,
      name: true,
    },
  })

  return jsonTyped(
    serialize({
      user: pick(user, ["name"]),
      buckets,
    }),
  )
}

export async function action({ request }: DataFunctionArgs) {
  return handleMethods(request, {
    async post() {
      const [body, bodyError] = await CreateBucketForm.getBody(request)
      if (!body) return bodyError

      const user = await sessionHelpers(request).getUser()
      if (!user) {
        return errorResponse(
          "you must be logged in to create a bucket",
          httpCodes.unauthorized,
        )
      }

      const bucket = await getClient().bucket.create({
        data: {
          name: body.name,
          ownerId: user.id,
          columns: [],
        },
        select: {
          id: true,
        },
      })

      return redirectTyped(`/buckets/${bucket.id}`, 303)
    },
  })
}

export default function BucketListPage() {
  const { user, buckets } = useLoaderDataTyped<typeof loader>()
  return (
    <AppLayout user={user}>
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
    </AppLayout>
  )
}
