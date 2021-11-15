import type { Bucket, Column, Thought } from "@prisma/client"
import { getClient } from "~/modules/db"

export type DatabaseBucket = Bucket & {
  columns: Array<Column & { thoughts: Thought[] }>
}

export async function getDatabaseBucket(
  bucketId: string,
): Promise<DatabaseBucket | undefined> {
  const bucket = await getClient().bucket.findUnique({
    where: {
      id: bucketId,
    },
    include: {
      columns: {
        include: {
          thoughts: true,
        },
      },
    },
  })
  return bucket ?? undefined
}
