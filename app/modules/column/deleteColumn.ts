import { requireBucketOwnership } from "~/modules/bucket/requireBucketOwnership"
import { getClient } from "~/modules/db"
import { getColumn } from "./getColumn"

export async function deleteColumn(columnId: string, request: Request) {
  const column = await getColumn(columnId)

  await requireBucketOwnership(column.bucketId, request)

  await getClient().column.delete({
    where: { id: columnId },
  })
}
