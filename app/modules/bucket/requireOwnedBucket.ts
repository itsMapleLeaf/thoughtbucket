import { requireUserOrRedirect } from "~/modules/auth/requireUserOrRedirect"
import { requireBucket } from "~/modules/bucket/requireBucket"
import { httpCodes } from "~/modules/network/http-codes"
import { errorResponse } from "~/modules/remix/error-response"

export async function requireOwnedBucket(request: Request, bucketId: string) {
  const bucket = await requireBucket(bucketId)
  const user = await requireUserOrRedirect(request)
  if (bucket.ownerId !== user?.id) {
    throw errorResponse("you don't own this bucket", httpCodes.forbidden)
  }
  return { bucket, user }
}
