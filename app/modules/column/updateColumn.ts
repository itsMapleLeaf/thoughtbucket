import { requireBucketOwnership } from "~/modules/bucket/requireBucketOwnership"
import { raise } from "~/modules/common/helpers"
import { getClient } from "~/modules/db"
import { httpCodes } from "~/modules/network/http-codes"
import { errorResponse } from "~/modules/remix/error-response"
import { getColumn } from "./getColumn"
import { UpdateColumnForm } from "./UpdateColumnForm"

export async function updateColumn(columnId: string, request: Request) {
  const body = await UpdateColumnForm.getBody(request)

  const db = getClient()

  const column = await getColumn(columnId)

  const bucket = await db.bucket.findUnique({
    where: { id: column.bucketId },
    select: {
      columns: {
        select: { id: true, name: true },
        orderBy: { order: "asc" },
      },
    },
  })
  if (!bucket) {
    raise(errorResponse("bucket not found", httpCodes.notFound))
  }

  await requireBucketOwnership(column.bucketId, request)

  if (body.name) {
    const column = bucket.columns.find((column) => column.id === columnId)
    if (column) column.name = body.name
  }

  if (body.order != null) {
    const index = bucket.columns.findIndex((column) => column.id === columnId)
    if (index > -1) {
      const removed = bucket.columns.splice(index, 1)
      bucket.columns.splice(body.order, 0, ...removed)
    }
  }

  await db.bucket.update({
    where: { id: column.bucketId },
    data: {
      columns: {
        update: bucket.columns.map(({ id, ...column }, order) => ({
          where: { id },
          data: { ...column, order },
        })),
      },
    },
  })
}
