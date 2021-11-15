import type { DatabaseBucket } from "~/modules/bucket/DatabaseBucket"
import { pick } from "~/modules/common/helpers"
import { serialize } from "../common/serialize"

export type ClientBucket = ReturnType<typeof asClientBucket>

export function asClientBucket(bucket: DatabaseBucket) {
  return serialize({
    ...pick(bucket, ["id", "name", "createdAt"]),
    columns: bucket.columns.map((column) => ({
      ...pick(column, ["id", "name"]),
      thoughts: column.thoughts.map((thought) => pick(thought, ["id", "text"])),
    })),
  })
}
