import { requireBucketOwnership } from "~/modules/bucket/requireBucketOwnership"
import { raise } from "~/modules/common/helpers"
import { getClient } from "~/modules/db"
import { httpCodes } from "~/modules/network/http-codes"
import { errorResponse } from "~/modules/remix/error-response"
import type { CreateColumnOutput } from "./CreateColumnForm"

export async function createColumn(body: CreateColumnOutput, request: Request) {
  const db = getClient()

  const bucket = await db.bucket.findUnique({
    where: { id: body.bucketId },
    select: { id: true, ownerId: true },
  })
  if (!bucket) raise(errorResponse("bucket not found", httpCodes.notFound))

  await requireBucketOwnership(bucket.id, request)

  const columnCount = await db.column.count({
    where: { bucketId: body.bucketId },
  })

  await db.column.create({
    data: { ...body, order: columnCount },
  })
}
