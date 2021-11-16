import { requireUserOrError } from "~/modules/auth/requireUserOrError"
import { raise } from "~/modules/common/helpers"
import { getClient } from "~/modules/db"
import { httpCodes } from "~/modules/network/http-codes"
import { errorResponse } from "~/modules/remix/error-response"

export async function requireBucketOwnership(
  bucketId: string,
  request: Request,
) {
  const user = await requireUserOrError(request)

  const bucket =
    (await getClient().bucket.findUnique({
      where: { id: bucketId },
      select: { ownerId: true },
    })) ?? raise(errorResponse("bucket not found", httpCodes.notFound))

  if (bucket.ownerId !== user?.id) {
    raise(errorResponse("you don't own this bucket", httpCodes.forbidden))
  }
}
