import type { Bucket } from "@prisma/client"
import { pick } from "../common/helpers"
import { serialize } from "../common/serialize"

export type ClientBucket = {
  id: string
  name: string
  createdAt: string
  ownerId: string
}

export function asClientBucket(bucket: Bucket): ClientBucket {
  return serialize(pick(bucket, ["id", "name", "createdAt", "ownerId"]))
}
