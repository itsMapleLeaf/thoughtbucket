import type { Bucket, User } from "@prisma/client"
import type { RuntimeContext, RuntimeResponse } from "next-runtime"
import { notFound } from "next-runtime"
import type { ParsedUrlQuery } from "next-runtime/types/querystring"
import { usingSessionUser } from "../auth/usingSessionUser"
import { usingBucket } from "./usingBucket"

export function usingOwnedBucket<Result>(
  context: RuntimeContext<ParsedUrlQuery>,
  bucketId: string,
  fn: (user: User, bucket: Bucket) => Result,
): Promise<Result | RuntimeResponse<never>> {
  return usingSessionUser(context, (user) => {
    return usingBucket(bucketId, (bucket) => {
      return bucket.ownerId === user.id ? fn(user, bucket) : notFound(401)
    })
  })
}
