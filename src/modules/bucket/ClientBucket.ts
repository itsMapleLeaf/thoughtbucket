import type { Bucket } from "@prisma/client"
import { pick, serialize } from "../../helpers"

export type ClientBucket = {
  id: string
  name: string
  createdAt: string
  ownerId: string
}

export function asClientBucket(bucket: Bucket): ClientBucket {
  return serialize(pick(bucket, ["id", "name", "createdAt", "ownerId"]))
}
