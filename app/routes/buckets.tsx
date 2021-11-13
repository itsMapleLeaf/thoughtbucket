import type { DataFunctionArgs } from "@remix-run/server-runtime"
import clsx from "clsx"
import { z } from "zod"
import { AppLayout } from "~/modules/app/AppLayout"
import { sessionHelpers } from "~/modules/auth/session"
import { BucketSummaryCard } from "~/modules/bucket/BucketSummaryCard"
import { pick } from "~/modules/common/helpers"
import { serialize } from "~/modules/common/serialize"
import { getClient } from "~/modules/db"
import { httpCodes } from "~/modules/network/http-codes"
import { allowMethods } from "~/modules/remix/allow-methods"
import {
  jsonTyped,
  redirectTyped,
  useLoaderDataTyped,
} from "~/modules/remix/data"
import { errorResponse } from "~/modules/remix/error-response"
import { createFormHelpers } from "~/modules/remix/form"
import { containerClass } from "~/modules/ui/container"

const PostForm = createFormHelpers(
  z.object({
    name: z.string(),
  }),
)

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
  allowMethods(request, "post")

  const [body, bodyError] = await PostForm.getBody(request)
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
