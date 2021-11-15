import type { DatabaseBucket } from "~/modules/bucket/DatabaseBucket"
import { getDatabaseBucket } from "~/modules/bucket/DatabaseBucket"
import { raise } from "~/modules/common/helpers"
import { httpCodes } from "~/modules/network/http-codes"
import { errorResponse } from "~/modules/remix/error-response"

export async function requireBucket(bucketId: string): Promise<DatabaseBucket> {
  const bucket = await getDatabaseBucket(bucketId)
  return bucket ?? raise(errorResponse("bucket not found", httpCodes.notFound))
}
