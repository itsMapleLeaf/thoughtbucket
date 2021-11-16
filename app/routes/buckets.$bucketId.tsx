import type { DataFunctionArgs } from "@remix-run/server-runtime"
import type { MetaFunction } from "remix"
import { getAppMeta } from "~/modules/app/getAppMeta"
import { BucketPageHeader } from "~/modules/bucket/BucketPageHeader"
import { updateBucket } from "~/modules/bucket/data"
import { requireBucketOwnership } from "~/modules/bucket/requireBucketOwnership"
import { ColumnEditor } from "~/modules/column/ColumnEditor"
import { raise } from "~/modules/common/helpers"
import { serialize } from "~/modules/common/serialize"
import { getClient } from "~/modules/db"
import { httpCodes } from "~/modules/network/http-codes"
import { catchErrorResponse } from "~/modules/remix/catchErrorResponse"
import {
  jsonTyped,
  redirectTyped,
  useLoaderDataTyped,
} from "~/modules/remix/data"
import { errorResponse } from "~/modules/remix/error-response"
import { handleMethods } from "~/modules/remix/handleMethods"

export async function loader({ params }: DataFunctionArgs) {
  const bucketId = params.bucketId ?? raise("bucketId param not found")
  const db = getClient()

  const bucket = await db.bucket.findUnique({
    where: { id: bucketId },
    select: {
      id: true,
      name: true,
      createdAt: true,
      columns: {
        select: {
          id: true,
          name: true,
          thoughts: {
            select: {
              id: true,
              columnId: true,
              text: true,
            },
          },
        },
      },
    },
  })

  if (!bucket) {
    raise(errorResponse("couldn't find that bucket", httpCodes.notFound))
  }

  return jsonTyped(serialize({ bucket: serialize(bucket) }))
}

export async function action({ request, params }: DataFunctionArgs) {
  const db = getClient()
  const bucketId = params.bucketId ?? raise("bucketId param not found")

  return catchErrorResponse(async () => {
    return handleMethods(request, {
      async patch() {
        await requireBucketOwnership(bucketId, request)
        await updateBucket(bucketId, request)
        return redirectTyped(`/buckets/${bucketId}`, httpCodes.seeOther)
      },

      async delete() {
        await requireBucketOwnership(bucketId, request)

        await db.bucket.delete({
          where: { id: bucketId },
        })

        return redirectTyped(`/buckets`, httpCodes.seeOther)
      },
    })
  })
}

export const meta: MetaFunction = ({ data }) => getAppMeta(data.bucket.name)

export default function BucketDetails() {
  const { bucket } = useLoaderDataTyped<typeof loader>()

  return (
    <div className="flex flex-col h-full">
      <BucketPageHeader bucket={bucket} />
      <ColumnEditor bucket={bucket} />
    </div>
  )
}
