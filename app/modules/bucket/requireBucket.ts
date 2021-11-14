import { httpCodes } from "~/modules/network/http-codes"
import { errorResponse } from "~/modules/remix/error-response"
import { getClient } from "../db"

export async function requireBucket(bucketId: string) {
  const db = getClient()

  const bucket = await db.bucket.findUnique({
    where: {
      id: bucketId,
    },
  })

  if (!bucket) {
    throw errorResponse("bucket not found", httpCodes.notFound)
  }

  return bucket
}
