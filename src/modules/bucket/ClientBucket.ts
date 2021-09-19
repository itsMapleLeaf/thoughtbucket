import type { RuntimeResponse } from "next-runtime"
import { notFound } from "next-runtime"
import { getClient } from "../../db/client"
import { serialize } from "../../helpers"

export type ClientBucket = {
  name: string
  id: string
  createdAt: string
  ownerId: string
  columns: Array<{ id: string; name: string }>
}

export const clientBucketSelection = {
  id: true,
  name: true,
  createdAt: true,
  ownerId: true,
  columns: {
    select: {
      id: true,
      name: true,
    },
  },
} as const

export async function usingClientBucket<Result>(
  bucketId: string,
  fn: (bucket: ClientBucket) => Result,
): Promise<Result | RuntimeResponse<never>> {
  const db = getClient()

  const bucket = await db.bucket.findUnique({
    where: {
      id: bucketId,
    },
    select: clientBucketSelection,
  })

  return bucket ? fn(serialize(bucket)) : notFound()
}
