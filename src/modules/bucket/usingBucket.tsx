import type { Bucket } from "@prisma/client"
import type { RuntimeResponse } from "next-runtime"
import { notFound } from "next-runtime"
import { getClient } from "../db"

export async function usingBucket<Result>(
  bucketId: string,
  fn: (bucket: Bucket) => Result,
): Promise<Result | RuntimeResponse<never>> {
  const db = getClient()

  const bucket = await db.bucket.findUnique({
    where: {
      id: bucketId,
    },
  })

  if (!bucket) {
    return notFound()
  }

  return fn(bucket)
}
